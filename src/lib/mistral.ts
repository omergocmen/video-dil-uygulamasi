import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY || '';
const client = new Mistral({ apiKey });

const SYSTEM_PROMPT = `Sen "LingoAssistant" adında bir İngilizce öğretmenisin. 
Görevin:
1. Kullanıcının İngilizce dil bilgisi, kelime ve çeviri sorularını yanıtlamak.
2. Cevaplarını verirken önce kısa bir açıklama yap, sonra örnek cümleler kur.
3. Seviyeye göre (A1-C2) dilini basitleştir veya karmaşıklaştır.
4. Kullanıcı hata yaparsa nazikçe düzelt ve nedenini açıkla.
5. Asla Türkçe dışında (açıklamalar hariç) çok uzun metinler yazma, pratik odaklı ol.`;

export async function chatWithMistral(
  userMessage: string,
  chatHistory: { role: 'user' | 'assistant'; content: string }[] = []
) {
  try {
    const messages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...chatHistory.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      { role: 'user' as const, content: userMessage }
    ];

    const response = await client.chat.complete({
      model: 'mistral-tiny',
      messages: messages
    });

    return response.choices[0]?.message?.content || 'Üzgünüm, bir hata oluştu.';
  } catch (error) {
    console.error('Mistral API error:', error);
    return 'Üzgünüm, şu anda AI asistanına ulaşılamıyor. Lütfen daha sonra tekrar deneyin.';
  }
}