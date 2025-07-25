import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * A prompt for correcting machine translation errors in Indonesian light novel content
 * @param server The MCP server instance
 */
export function correctTranslationPrompt(server: McpServer): void {
  const description =
    'A prompt template for correcting machine translation errors in Indonesian light novel content from sakuranovel.id';

  server.prompt('correct-translation', description, () => {
    const prompt = `You are tasked with correcting machine translation errors in Indonesian light novel content. The content from sakuranovel.id often contains literal translations that miss the intended meaning or context.

## Common Translation Issues to Correct:

### 1. Race/Species Names
- "Beastskin" or "Beast-skin" → "Ras Binatang" (NOT "Kulit Binatang")
- "Dragonkin" → "Ras Naga" (NOT "Kulit Naga")
- "Demonkin" → "Ras Iblis" (NOT "Kulit Iblis")
- "Elven" → "Elf" or "Ras Elf" (NOT "Peri")

### 2. Fantasy Terms
- "Skill" in RPG context → Keep as "Skill" (NOT "Kemampuan" or "Keahlian")
- "Status Window" → "Jendela Status" (NOT "Jendela Keadaan")
- "Level Up" → Keep as "Level Up" or "Naik Level"
- "Guild" → Keep as "Guild" (NOT "Serikat" or "Perkumpulan")
- "Dungeon" → Keep as "Dungeon" (NOT "Penjara Bawah Tanah")
- "Magic Circle" → "Lingkaran Sihir" (NOT "Lingkaran Ajaib")

### 3. Titles and Honorifics
- Japanese honorifics (-san, -sama, -kun, -chan) → Keep as is or adapt contextually
- "Young Master" → "Tuan Muda"
- "Elder" → "Tetua" (NOT "Orang Tua" which means parents)
- "Sect Leader" → "Pemimpin Sekte" or "Ketua Sekte"

### 4. Common Mistranslations
- "Cultivation" (in xianxia context) → "Kultivasi" (NOT "Pertanian" or "Budidaya")
- "Breakthrough" (cultivation) → "Terobosan" or "Penembusan" (NOT "Terobosan" in business sense)
- "Foundation Building" → "Pembangunan Fondasi" (NOT "Pembangunan Gedung")
- "Spirit Stone" → "Batu Roh" (NOT "Batu Semangat")
- "Meridian" → Keep as "Meridian" (NOT "Garis Bujur")

### 5. Contextual Corrections
- Fix awkward sentence structures caused by literal translation
- Ensure pronouns match the character's gender consistently
- Correct verb tenses that don't make sense in Indonesian
- Fix dialogue that sounds unnatural in Indonesian

## Guidelines:
1. Preserve the original story meaning and intent
2. Keep commonly accepted gaming/fantasy terms in English when appropriate
3. Make the text flow naturally in Indonesian
4. Maintain consistency in terminology throughout the text
5. Consider the target audience (Indonesian light novel readers familiar with the genre)

When you encounter the translated content, please:
- Identify obvious machine translation errors
- Correct them based on context and genre conventions
- Ensure the final text reads naturally while preserving the original meaning
- Flag any ambiguous sections where the original meaning is unclear`;

    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: prompt,
          },
        },
      ],
    };
  });
}
