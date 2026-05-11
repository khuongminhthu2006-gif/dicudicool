const QUESTION_BANK = [
  {
    id: 1,
    category: '?ng x?',
    question: 'Khi b?n th?y ngu?i kh�c b? b?t n?t, b?n n�n l�m g�?',
    answer: 'B�o cho gi�o vi�n ho?c ngu?i l?n d�ng tin c?y, d?ng th?i gi�p b?n b? b?t n?t n?u an to�n.',
    keywords: ['b�o', 'gi�o vi�n', 'ngu?i l?n', 'gi�p']
  },
  {
    id: 2,
    category: 'An to�n',
    question: 'N?u c� ngu?i l? xin th�ng tin c� nh�n c?a b?n tr�n m?ng, b?n n�n l�m g�?',
    answer: 'Kh�ng cung c?p th�ng tin c� nh�n v� b�o cho ngu?i l?n.',
    keywords: ['kh�ng', 'b�o', 'ngu?i l?n']
  },
  {
    id: 3,
    category: 'H?c t?p',
    question: 'Mu?n ghi nh? b�i t?t hon, b?n n�n l�m g� sau khi h?c?',
    answer: '�n l?i ki?n th?c, t? d?t c�u h?i v� luy?n t?p b?ng v� d?.',
    keywords: ['�n', 'luy?n', 'c�u h?i', 'v� d?']
  },
  {
    id: 4,
    category: 'C?m x�c',
    question: 'Khi t?c gi?n, b?n n�n l�m g� tru?c khi n�i chuy?n ti?p?',
    answer: 'B�nh tinh l?i, h�t th? s�u v� suy nghi tru?c khi n�i.',
    keywords: ['b�nh tinh', 'h�t th?', 'suy nghi']
  },
  {
    id: 5,
    category: 'S?c kh?e',
    question: 'V� sao c?n r?a tay tru?c khi an?',
    answer: '�? lo?i b? vi khu?n, gi? v? sinh v� ph�ng b?nh.',
    keywords: ['vi khu?n', 'v? sinh', 'ph�ng b?nh']
  },
  {
    id: 6,
    category: 'An to�n',
    question: 'Khi nh?n du?c du?ng link l? t? ngu?i kh�ng quen, b?n n�n l�m g�?',
    answer: 'Kh�ng b?m v�o link l?, kh�ng nh?p th�ng tin c� nh�n v� b�o cho ngu?i l?n n?u nghi ng?.',
    keywords: ['kh�ng b?m', 'link l?', 'b�o', 'ngu?i l?n']
  },
  {
    id: 7,
    category: '?ng x?',
    question: 'N?u l? l�m b?n bu?n, b?n n�n n�i g� tru?c ti�n?',
    answer: 'N�n xin l?i ch�n th�nh, l?ng nghe c?m x�c c?a b?n v� t�m c�ch s?a l?i.',
    keywords: ['xin l?i', 'l?ng nghe', 's?a l?i']
  },
  {
    id: 8,
    category: 'H?c t?p',
    question: 'Khi g?p b�i kh�, c�ch x? l� t?t l� g�?',
    answer: '�?c l?i d?, chia b�i th�nh t?ng bu?c nh?, th? c�ch l�m v� h?i th?y c� ho?c b?n b� khi c?n.',
    keywords: ['d?c l?i', 't?ng bu?c', 'h?i']
  },
  {
    id: 9,
    category: 'C?m x�c',
    question: 'Khi c?m th?y lo l?ng tru?c b�i ki?m tra, b?n c� th? l�m g�?',
    answer: 'Chu?n b? b�i s?m, h�t th? s�u, ngh? ngoi d? v� t? nh?c m�nh l�m t?ng c�u m?t.',
    keywords: ['chu?n b?', 'h�t th?', 'ngh? ngoi']
  },
  {
    id: 10,
    category: 'S?c kh?e',
    question: 'V� sao c?n ng? d? gi?c?',
    answer: 'Ng? d? gi�p co th? ph?c h?i, d?u �c t?nh t�o, ghi nh? t?t hon v� gi? s?c kh?e.',
    keywords: ['ph?c h?i', 't?nh t�o', 'ghi nh?', 's?c kh?e']
  },
  {
    id: 11,
    category: 'An to�n',
    question: 'N?u b? ngu?i l? r? di theo, b?n n�n ph?n ?ng th? n�o?',
    answer: 'T? ch?i, gi? kho?ng c�ch, di d?n noi d�ng ngu?i v� b�o ngay cho ngu?i l?n d�ng tin c?y.',
    keywords: ['t? ch?i', 'kho?ng c�ch', 'd�ng ngu?i', 'b�o']
  },
  {
    id: 12,
    category: '?ng x?',
    question: 'Khi l�m vi?c nh�m, di?u g� gi�p c? nh�m hi?u qu? hon?',
    answer: 'Bi?t l?ng nghe, chia vi?c r� r�ng, t�n tr?ng � ki?n nhau v� ho�n th�nh ph?n vi?c c?a m�nh.',
    keywords: ['l?ng nghe', 'chia vi?c', 't�n tr?ng', 'ho�n th�nh']
  },
  {
    id: 13,
    category: 'H?c t?p',
    question: 'Mu?n thuy?t tr�nh t? tin hon, b?n n�n chu?n b? g�?',
    answer: 'N?m � ch�nh, luy?n n�i tru?c, chu?n b? v� d? v� n�i r� r�ng v?i t?c d? v?a ph?i.',
    keywords: ['� ch�nh', 'luy?n n�i', 'v� d?', 'r� r�ng']
  },
  {
    id: 14,
    category: 'C?m x�c',
    question: 'Khi b?n b? ch�, ph?n ?ng n�o l� ph� h?p?',
    answer: 'B�nh tinh l?ng nghe, xem g�p � n�o d�ng d? c?i thi?n v� kh�ng d�p tr? b?ng l?i kh� nghe.',
    keywords: ['b�nh tinh', 'l?ng nghe', 'c?i thi?n']
  },
  {
    id: 15,
    category: 'S?c kh?e',
    question: 'T?i sao c?n u?ng d? nu?c m?i ng�y?',
    answer: 'Nu?c gi�p co th? ho?t d?ng t?t, h? tr? t?p trung, ti�u h�a v� di?u h�a nhi?t d?.',
    keywords: ['co th?', 't?p trung', 'ti�u h�a', 'nhi?t d?']
  },
  {
    id: 16,
    category: 'An to�n m?ng',
    question: 'M?t kh?u an to�n n�n c� d?c di?m g�?',
    answer: 'N�n d? d�i, kh� do�n, c� ch?, s?, k� t? d?c bi?t v� kh�ng d�ng chung cho nhi?u t�i kho?n.',
    keywords: ['d�i', 'kh� do�n', 's?', 'k� t?', 'kh�ng d�ng chung']
  },
  {
    id: 17,
    category: '?ng x?',
    question: 'Khi th?y b?n m?c l?i, g�p � th? n�o d? b?n d? ti?p nh?n?',
    answer: 'G�p � ri�ng tu, n�i nh? nh�ng, t?p trung v�o h�nh d?ng c?n s?a thay v� ch� con ngu?i.',
    keywords: ['ri�ng tu', 'nh? nh�ng', 'h�nh d?ng']
  },
  {
    id: 18,
    category: 'H?c t?p',
    question: 'Ghi ch� b�i h?c hi?u qu? n�n l�m nhu th? n�o?',
    answer: 'Ghi � ch�nh, d�ng g?ch d?u d�ng, d�nh d?u ph?n quan tr?ng v� xem l?i sau bu?i h?c.',
    keywords: ['� ch�nh', 'g?ch d?u d�ng', 'quan tr?ng', 'xem l?i']
  },
  {
    id: 19,
    category: 'C?m x�c',
    question: 'Khi qu� m?t ho?c cang th?ng, b?n n�n l�m g�?',
    answer: 'T?m ngh?, h�t th?, v?n d?ng nh?, n�i v?i ngu?i tin c?y v� quay l?i vi?c khi b�nh tinh hon.',
    keywords: ['t?m ngh?', 'h�t th?', 'v?n d?ng', 'ngu?i tin c?y']
  },
  {
    id: 20,
    category: 'S?c kh?e',
    question: 'V� sao c?n v?n d?ng m?i ng�y?',
    answer: 'V?n d?ng gi�p co th? kh?e hon, tinh th?n tho?i m�i, ng? ngon v� tang kh? nang t?p trung.',
    keywords: ['kh?e', 'tho?i m�i', 'ng? ngon', 't?p trung']
  }
];

export default QUESTION_BANK;

