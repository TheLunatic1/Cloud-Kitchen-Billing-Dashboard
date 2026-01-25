const ones = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const tens = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

const thousands = ['', 'Thousand', 'Million', 'Billion'];

/**
 * Converts a number to English words
 * Handles up to billions
 */
export function numberToWordsBDT(num) {
  if (num === 0) return 'Zero Only';

  if (typeof num !== 'number' || isNaN(num)) return '';

  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);

  let words = convertToWords(integerPart);

  if (decimalPart > 0) {
    words += ` and ${convertToWords(decimalPart)} Paisa`;
  }

  return words.trim() + ' Only';
}

function convertToWords(n) {
  if (n === 0) return '';

  let word = '';
  let i = 0;

  while (n > 0) {
    if (n % 1000 !== 0) {
      let part = n % 1000;
      let partWords = '';

      if (part >= 100) {
        partWords += ones[Math.floor(part / 100)] + ' Hundred ';
        part %= 100;
      }

      if (part >= 20) {
        partWords += tens[Math.floor(part / 10)] + ' ';
        part %= 10;
      }

      if (part > 0) {
        partWords += ones[part] + ' ';
      }

      word = partWords.trim() + ' ' + thousands[i] + ' ' + word;
    }

    n = Math.floor(n / 1000);
    i++;
  }

  return word.trim();
}