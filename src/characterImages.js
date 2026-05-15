import character1 from '../img/character1.png';
import character2 from '../img/character2.png';
import character3 from '../img/character3.png';
import character4 from '../img/character4.png';

export const characterOptions = [
  { value: 'character-1', label: 'Nhân vật 1', image: character1 },
  { value: 'character-2', label: 'Nhân vật 2', image: character2 },
  { value: 'character-3', label: 'Nhân vật 3', image: character3 },
  { value: 'character-4', label: 'Nhân vật 4', image: character4 },
];

export const getCharacterOption = (character, fallbackId = 1) => {
  const characterNumber = String(character ?? '').match(/[1-4]/)?.[0] ?? String(fallbackId);
  const normalizedValue = `character-${characterNumber}`;

  return characterOptions.find((option) => option.value === normalizedValue) ?? characterOptions[0];
};

export const getFirstAvailableCharacterValue = (usedCharacterValues) => (
  characterOptions.find((option) => !usedCharacterValues.has(option.value))?.value
  ?? characterOptions[0].value
);
