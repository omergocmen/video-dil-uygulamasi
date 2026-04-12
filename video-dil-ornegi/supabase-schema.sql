-- LingoMaster - Supabase Tablo Yapısı
-- Bu SQL'i Supabase SQL Editor'da çalıştırın

-- Bölümler Tablosu
CREATE TABLE IF NOT EXISTS levels (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  order_index INT NOT NULL
);

-- Sorular Tablosu
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  level_id INT REFERENCES levels(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  type TEXT CHECK (type IN ('multiple_choice', 'fill_in_the_blank')),
  options JSONB,
  correct_answer TEXT NOT NULL
);

-- Kullanıcı İlerleme (Opsiyonel - localStorage da kullanılabilir)
CREATE TABLE IF NOT EXISTS progress (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  current_level_id INT REFERENCES levels(id) DEFAULT 1,
  PRIMARY KEY (user_id)
);

-- Örnek Veriler
INSERT INTO levels (title, order_index) VALUES
  ('Temel Selamlaşmalar', 1),
  ('Günlük Kelimeler', 2),
  ('Cümle Kurma', 3);

INSERT INTO questions (level_id, question_text, type, options, correct_answer) VALUES
  (1, 'How do you say "Merhaba" in English?', 'multiple_choice', '["Hello", "Goodbye", "Thanks", "Sorry"]', 'Hello'),
  (1, 'What is the English word for "Teşekkürler"?', 'multiple_choice', '["Please", "Thank you", "Sorry", "Yes"]', 'Thank you'),
  (1, 'Complete: Good___ (İyi sabahlar)', 'fill_in_the_blank', NULL, 'morning'),
  (2, 'What is "Elma" in English?', 'multiple_choice', '["Apple", "Orange", "Banana", "Grape"]', 'Apple'),
  (2, 'Translate: "Kırmızı"', 'fill_in_the_blank', NULL, 'red'),
  (2, 'Which one means "Kitap"?', 'multiple_choice', '["Pen", "Book", "Table", "Chair"]', 'book');

-- Row Level Security (RLS) - İsteğe bağlı
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir
CREATE POLICY "Allow read access for all users" ON levels FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON questions FOR SELECT USING (true);

-- Sadece authenticated kullanıcılar yazabilir (admin için)
CREATE POLICY "Allow insert for authenticated users" ON levels FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow insert for authenticated users" ON questions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow delete for authenticated users" ON levels FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow delete for authenticated users" ON questions FOR DELETE USING (auth.role() = 'authenticated');