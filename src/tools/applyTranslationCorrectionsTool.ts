import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

interface TranslationRule {
  pattern: RegExp;
  replacement: string;
  description: string;
}

/**
 * Common translation correction rules
 */
const translationRules: TranslationRule[] = [
  // Race/Species corrections
  {
    pattern: /\bKulit Binatang\b/gi,
    replacement: 'Ras Binatang',
    description: 'Beastskin race correction',
  },
  {
    pattern: /\bBeast-?skin\b/gi,
    replacement: 'Ras Binatang',
    description: 'Beastskin race correction (English)',
  },
  {
    pattern: /\bKulit Naga\b/gi,
    replacement: 'Ras Naga',
    description: 'Dragonkin race correction',
  },
  {
    pattern: /\bDragonkin\b/gi,
    replacement: 'Ras Naga',
    description: 'Dragonkin race correction (English)',
  },
  {
    pattern: /\bKulit Iblis\b/gi,
    replacement: 'Ras Iblis',
    description: 'Demonkin race correction',
  },
  {
    pattern: /\bDemonkin\b/gi,
    replacement: 'Ras Iblis',
    description: 'Demonkin race correction (English)',
  },
  {
    pattern: /\bKulit Serigala\b/gi,
    replacement: 'Ras Serigala',
    description: 'Wolfkin race correction',
  },
  {
    pattern: /\bWolfkin\b/gi,
    replacement: 'Ras Serigala',
    description: 'Wolfkin race correction (English)',
  },
  {
    pattern: /\bKulit Kucing\b/gi,
    replacement: 'Ras Kucing',
    description: 'Catkin race correction',
  },
  {
    pattern: /\bCatkin\b/gi,
    replacement: 'Ras Kucing',
    description: 'Catkin race correction (English)',
  },
  {
    pattern: /\bKulit Rubah\b/gi,
    replacement: 'Ras Rubah',
    description: 'Foxkin race correction',
  },
  {
    pattern: /\bFoxkin\b/gi,
    replacement: 'Ras Rubah',
    description: 'Foxkin race correction (English)',
  },
  {
    pattern: /\bPeri\b(?!\s+(?:gigi|godmother|tale))/gi,
    replacement: 'Elf',
    description: 'Elf race correction (avoiding fairy-related terms)',
  },

  // Fantasy/Gaming terms that should remain in English
  {
    pattern: /\bKemampuan\b(?=\s+(?:aktif|pasif|khusus))/gi,
    replacement: 'Skill',
    description: 'Skill term in gaming context',
  },
  {
    pattern: /\bKeahlian\b(?=\s+(?:aktif|pasif|khusus))/gi,
    replacement: 'Skill',
    description: 'Skill term in gaming context',
  },
  {
    pattern: /\bJendela Keadaan\b/gi,
    replacement: 'Jendela Status',
    description: 'Status Window correction',
  },
  {
    pattern: /\bPenjara Bawah Tanah\b/gi,
    replacement: 'Dungeon',
    description: 'Dungeon term correction',
  },
  {
    pattern: /\bSerikat\b(?=\s+(?:petualang|pedagang|pemburu))/gi,
    replacement: 'Guild',
    description: 'Guild term correction',
  },
  {
    pattern: /\bPerkumpulan\b(?=\s+(?:petualang|pedagang|pemburu))/gi,
    replacement: 'Guild',
    description: 'Guild term correction',
  },

  // Magic terms
  {
    pattern: /\bLingkaran Ajaib\b/gi,
    replacement: 'Lingkaran Sihir',
    description: 'Magic Circle correction',
  },
  {
    pattern: /\bPesulap\b(?!\s+(?:jalanan|panggung))/gi,
    replacement: 'Penyihir',
    description: 'Mage/Wizard correction',
  },

  // Cultivation terms
  {
    pattern: /\bPertanian\b(?=\s+(?:spiritual|rohani|qi))/gi,
    replacement: 'Kultivasi',
    description: 'Cultivation correction in xianxia context',
  },
  {
    pattern: /\bBudidaya\b(?=\s+(?:spiritual|rohani|qi))/gi,
    replacement: 'Kultivasi',
    description: 'Cultivation correction in xianxia context',
  },
  {
    pattern: /\bBatu Semangat\b/gi,
    replacement: 'Batu Roh',
    description: 'Spirit Stone correction',
  },
  {
    pattern: /\bPembangunan Gedung\b(?=.*(?:tahap|tingkat|realm))/gi,
    replacement: 'Pembangunan Fondasi',
    description: 'Foundation Building stage correction',
  },
  {
    pattern: /\bGaris Bujur\b(?=.*(?:tubuh|energi|qi))/gi,
    replacement: 'Meridian',
    description: 'Meridian correction in cultivation context',
  },

  // Title corrections
  {
    pattern: /\bOrang Tua\b(?=\s+(?:sekte|guild|desa))/gi,
    replacement: 'Tetua',
    description: 'Elder title correction',
  },

  // Common phrase improvements
  {
    pattern: /\bApakah kamu memiliki\b/gi,
    replacement: 'Kamu punya',
    description: 'Natural Indonesian phrasing',
  },
  {
    pattern: /\bAku akan pergi ke sana\b/gi,
    replacement: 'Aku mau ke sana',
    description: 'Natural Indonesian phrasing',
  },
  {
    pattern: /\bDia sedang dalam perjalanan\b/gi,
    replacement: 'Dia lagi jalan',
    description: 'Natural Indonesian phrasing',
  },
];

/**
 * Apply translation corrections to text
 */
function applyCorrections(
  text: string,
  aggressive: boolean = false
): {
  correctedText: string;
  corrections: Array<{ original: string; corrected: string; description: string }>;
} {
  let correctedText = text;
  const corrections: Array<{ original: string; corrected: string; description: string }> = [];

  // Apply each rule
  for (const rule of translationRules) {
    const matches = correctedText.match(rule.pattern);
    if (matches) {
      matches.forEach(match => {
        if (!corrections.some(c => c.original === match)) {
          corrections.push({
            original: match,
            corrected: rule.replacement,
            description: rule.description,
          });
        }
      });
      correctedText = correctedText.replace(rule.pattern, rule.replacement);
    }
  }

  // Additional aggressive corrections if enabled
  if (aggressive) {
    // Fix spacing around punctuation
    correctedText = correctedText.replace(/\s+([.,!?;:])/g, '$1');
    correctedText = correctedText.replace(/([.,!?;:])\s{2,}/g, '$1 ');

    // Fix double spaces
    correctedText = correctedText.replace(/\s{2,}/g, ' ');

    // Ensure proper capitalization after periods
    correctedText = correctedText.replace(
      /\.\s+([a-z])/g,
      (match, letter) => `. ${letter.toUpperCase()}`
    );
  }

  return { correctedText, corrections };
}

/**
 * A tool that applies translation corrections to Indonesian light novel content
 * @param server The MCP server instance
 */
export function applyTranslationCorrectionsTool(server: McpServer): void {
  server.tool(
    'apply-translation-corrections',
    {
      text: z.string().describe('The Indonesian text content to correct'),
      aggressive: z
        .boolean()
        .optional()
        .default(false)
        .describe('Apply aggressive corrections including formatting and spacing'),
      showCorrections: z
        .boolean()
        .optional()
        .default(true)
        .describe('Show a list of corrections made'),
    },
    async ({ text, aggressive, showCorrections }) => {
      try {
        const { correctedText, corrections } = applyCorrections(text, aggressive);

        let response = correctedText;

        if (showCorrections && corrections.length > 0) {
          response += '\n\n---\n\n## Corrections Applied:\n\n';
          corrections.forEach(({ original, corrected, description }) => {
            response += `- "${original}" → "${corrected}" (${description})\n`;
          });
          response += `\nTotal corrections: ${corrections.length}`;
        } else if (showCorrections && corrections.length === 0) {
          response += '\n\n---\n\nNo corrections were needed.';
        }

        return {
          content: [
            {
              type: 'text',
              text: response,
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
          content: [
            {
              type: 'text',
              text: `Error applying translation corrections: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
