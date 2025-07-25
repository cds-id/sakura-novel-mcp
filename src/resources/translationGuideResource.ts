import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * A resource that provides comprehensive translation correction guidelines
 * @param server The MCP server instance
 */
export function translationGuideResource(server: McpServer): void {
  server.resource('translation-guide', 'guide://translation/corrections', async uri => ({
    contents: [
      {
        uri: uri.href,
        text: `# Indonesian Light Novel Translation Correction Guide

This guide helps correct common machine translation errors found in Indonesian light novel content from sakuranovel.id.

## 1. Race and Species Terms

### Common Errors:
| Original Term | Wrong Translation | Correct Translation |
|--------------|------------------|-------------------|
| Beastskin/Beast-skin | Kulit Binatang | Ras Binatang |
| Dragonkin | Kulit Naga | Ras Naga |
| Demonkin | Kulit Iblis | Ras Iblis |
| Wolfkin | Kulit Serigala | Ras Serigala |
| Catkin | Kulit Kucing | Ras Kucing |
| Foxkin | Kulit Rubah | Ras Rubah |
| Elven/Elf | Peri | Elf / Ras Elf |
| Dwarven/Dwarf | Kerdil | Dwarf / Kurcaci |
| Human | Manusia | Manusia ✓ |
| Undead | Mayat Hidup | Undead / Mayat Hidup ✓ |

### Why This Matters:
- "Kulit Binatang" literally means "animal skin/hide" (like leather)
- "Ras Binatang" correctly means "beast race/species"
- The suffix "-kin" refers to race/species, not skin

## 2. RPG and Gaming Terms

### Keep in English:
- Skill → Skill ✓ (NOT Kemampuan/Keahlian)
- Level → Level ✓
- HP (Hit Points) → HP ✓
- MP (Mana Points) → MP ✓
- EXP/XP → EXP/XP ✓
- Stats → Stats ✓
- Build → Build ✓
- Item → Item ✓
- Drop → Drop ✓
- Buff/Debuff → Buff/Debuff ✓
- Guild → Guild ✓ (NOT Serikat/Perkumpulan)
- Party → Party ✓ (NOT Pesta/Kelompok)
- Dungeon → Dungeon ✓ (NOT Penjara Bawah Tanah)
- Boss → Boss ✓
- Raid → Raid ✓
- Quest → Quest ✓ (or Misi)
- NPC → NPC ✓

### Translate Contextually:
| Term | Context | Translation |
|------|---------|-------------|
| Status Window | Game UI | Jendela Status |
| Skill Tree | Game System | Pohon Skill |
| Level Up | Action | Naik Level |
| Class | Character Type | Class / Kelas |
| Job | Profession | Job / Pekerjaan |

## 3. Cultivation Terms (Xianxia/Wuxia)

| Term | Wrong | Correct |
|------|-------|---------|
| Cultivation | Pertanian/Budidaya | Kultivasi |
| Qi/Chi | Udara/Angin | Qi/Chi ✓ |
| Breakthrough | Terobosan (business) | Tembus Batas / Terobosan Kultivasi |
| Foundation Building | Pembangunan Gedung | Pembangunan Fondasi |
| Core Formation | Pembentukan Inti | Pembentukan Inti ✓ |
| Nascent Soul | Jiwa Baru Lahir | Nascent Soul / Jiwa Purba |
| Spirit Stone | Batu Semangat | Batu Roh |
| Meridian | Garis Bujur | Meridian ✓ |
| Dantian | (various wrong) | Dantian ✓ |
| Sect | Bagian/Golongan | Sekte |
| Inner Disciple | Murid Dalam | Murid Inti |
| Outer Disciple | Murid Luar | Murid Luar ✓ |

## 4. Magic and Fantasy Terms

| Term | Wrong | Correct |
|------|-------|---------|
| Magic Circle | Lingkaran Ajaib | Lingkaran Sihir |
| Spell | Mantra/Ejaan | Mantra ✓ / Sihir |
| Mage/Wizard | Pesulap | Penyihir |
| Sorcerer | Tukang Sihir | Penyihir Ulung |
| Artifact | Artefak | Artefak ✓ |
| Enchantment | Pesona | Enchantment / Sihir Permanen |
| Summon | Panggil | Summon / Panggil ✓ |
| Familiar | Akrab/Kenal | Familiar ✓ |
| Mana | (various) | Mana ✓ |
| Aura | Aura | Aura ✓ |

## 5. Titles and Honorifics

### Japanese Honorifics:
- -san → Tuan/Nyonya or keep as -san
- -sama → Tuan/Nyonya (respectful) or keep as -sama
- -kun → Keep as -kun or omit
- -chan → Keep as -chan or omit
- -senpai → Senior or keep as Senpai
- -sensei → Guru or keep as Sensei

### Common Titles:
| Title | Translation |
|-------|-------------|
| Young Master | Tuan Muda |
| Young Miss | Nona Muda |
| Elder | Tetua (NOT Orang Tua = parents) |
| Patriarch | Kepala Keluarga |
| Ancestor | Leluhur |
| Saint/Saintess | Santo/Santa |
| Hero | Pahlawan |
| Demon Lord | Raja Iblis |
| Dragon King | Raja Naga |

## 6. Common Mistranslation Patterns

### Pronouns:
- Ensure consistency: if a character is male, use "dia/ia" not "itu"
- "You" formal → "Anda"
- "You" informal → "Kamu"
- "You" very informal → "Kau"

### Tense Issues:
- Indonesian doesn't have verb conjugation for tenses
- Use time markers: sudah (already), akan (will), sedang (currently)
- Don't overuse "telah" - "sudah" is more natural in most contexts

### Awkward Literal Translations:
| Literal (Wrong) | Natural (Correct) |
|-----------------|------------------|
| "Aku akan pergi ke sana" | "Aku mau ke sana" |
| "Dia sedang dalam perjalanan" | "Dia lagi jalan" |
| "Apakah kamu memiliki..." | "Kamu punya..." |

## 7. Context-Specific Guidelines

### Battle Scenes:
- Keep attack names in original or translate meaningfully
- "Sword Art" → "Seni Pedang" ✓
- "Flame Burst" → Keep as "Flame Burst" or "Ledakan Api"

### System Messages:
- Format consistently with brackets or special formatting
- [You have gained 100 EXP] → [Anda mendapatkan 100 EXP]
- <Skill Acquired: Fireball> → <Skill Diperoleh: Fireball>

### Dialogue:
- Make it sound natural in Indonesian
- Avoid overly formal language unless the character is meant to be formal
- Use appropriate slang/colloquialisms for younger characters

## 8. Quality Check Questions

When reviewing translated content, ask:
1. Does this sound natural when read aloud in Indonesian?
2. Is the fantasy/gaming terminology consistent throughout?
3. Are character genders consistent with their pronouns?
4. Do the sentences flow logically?
5. Is the formality level appropriate for the context?

## 9. Red Flags for Machine Translation

Watch out for:
- Inconsistent character names/spellings
- Gender pronouns switching randomly
- Overly literal idiom translations
- "Skin" appearing where it shouldn't (likely "-kin" mistranslation)
- Sentences that make no logical sense
- Modern/technical terms in fantasy settings

## 10. Best Practices

1. **Consistency is Key**: Once you choose a translation for a term, stick with it
2. **Know Your Audience**: Indonesian light novel readers are familiar with gaming/anime terms
3. **Preserve Flavor**: Keep the fantasy/gaming atmosphere
4. **Natural Flow**: Prioritize readability over literal accuracy
5. **Context Matters**: The same word might translate differently based on context

---

Last Updated: ${new Date().toISOString()}
Generated by: MCP Translation Guide Resource`,
      },
    ],
  }));
}
