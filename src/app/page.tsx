'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  // Estado para controlar se está no cliente
  const [mounted, setMounted] = useState(false);
  
  // Timer de contagem regressiva (24 horas)
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  // Marcar como montado no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Atualizar timer a cada segundo
  useEffect(() => {
    if (!mounted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mounted]);

  const handleComprar = () => {
    window.open('https://pay.kiwify.com.br/rIEIgL6', '_blank');
  };

  const handleTestarProduto = () => {
    // Simula um acesso de teste
    localStorage.setItem('email_comprador', 'teste@exemplo.com');
    router.push('/produto');
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background com efeito de partículas */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-red-950/20 to-black"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZjAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>

      {/* Botão de Teste - Fixo no canto superior direito */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={handleTestarProduto}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-sm rounded-lg shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-blue-400 uppercase tracking-wide flex items-center gap-2"
        >
          <span>🧪</span>
          <span>Testar Produto</span>
        </button>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl">
          {/* Banner Black Friday */}
          <div className="bg-gradient-to-r from-red-600 via-black to-red-600 rounded-t-2xl p-6 text-center border-4 border-red-500 animate-pulse">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-4xl">🔥</span>
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wider">
                Black Friday
              </h2>
              <span className="text-4xl">🔥</span>
            </div>
            <p className="text-red-200 text-lg font-semibold">
              Oferta Exclusiva - Tempo Limitado!
            </p>
          </div>

          {/* Timer de Contagem Regressiva */}
          <div className="bg-red-600 p-6 border-x-4 border-red-500">
            <p className="text-white text-center text-sm font-semibold mb-3 uppercase tracking-wide">
              ⏰ A oferta termina em:
            </p>
            <div className="flex justify-center gap-4">
              <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 min-w-[80px] border-2 border-red-400">
                <div className="text-3xl md:text-4xl font-black text-white text-center">
                  {mounted ? String(timeLeft.hours).padStart(2, '0') : '23'}
                </div>
                <div className="text-red-200 text-xs text-center mt-1 uppercase font-semibold">
                  Horas
                </div>
              </div>
              <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 min-w-[80px] border-2 border-red-400">
                <div className="text-3xl md:text-4xl font-black text-white text-center">
                  {mounted ? String(timeLeft.minutes).padStart(2, '0') : '59'}
                </div>
                <div className="text-red-200 text-xs text-center mt-1 uppercase font-semibold">
                  Minutos
                </div>
              </div>
              <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 min-w-[80px] border-2 border-red-400">
                <div className="text-3xl md:text-4xl font-black text-white text-center">
                  {mounted ? String(timeLeft.seconds).padStart(2, '0') : '59'}
                </div>
                <div className="text-red-200 text-xs text-center mt-1 uppercase font-semibold">
                  Segundos
                </div>
              </div>
            </div>
          </div>

          {/* Card principal */}
          <div className="bg-gradient-to-b from-gray-900 to-black rounded-b-2xl p-8 md:p-12 shadow-2xl border-x-4 border-b-4 border-red-500">
            {/* Cabeçalho */}
            <div className="text-center mb-8">
              <div className="inline-block bg-red-600 text-white px-6 py-2 rounded-full text-sm font-bold uppercase mb-4 animate-bounce">
                🎁 Desconto Especial Ativo
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                Combo 3 em 1 ATB
              </h1>
              <p className="text-gray-300 text-lg md:text-xl font-semibold">
                Numerologia + Mapa Astral + Limpeza Espiritual
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="text-gray-500 line-through text-2xl">R$ 197,00</span>
                <span className="text-red-500 text-4xl font-black">R$ 97,00</span>
              </div>
              <p className="text-green-400 font-bold text-lg mt-2">
                💰 Economize R$ 100,00 agora!
              </p>
            </div>

            {/* Badges de benefícios */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-red-500/20 border-2 border-red-500 rounded-lg p-4 text-center">
                <div className="text-2xl mb-1">⚡</div>
                <p className="text-white font-bold text-sm">Acesso Imediato</p>
              </div>
              <div className="bg-red-500/20 border-2 border-red-500 rounded-lg p-4 text-center">
                <div className="text-2xl mb-1">🎯</div>
                <p className="text-white font-bold text-sm">100% Personalizado</p>
              </div>
              <div className="bg-red-500/20 border-2 border-red-500 rounded-lg p-4 text-center">
                <div className="text-2xl mb-1">🔒</div>
                <p className="text-white font-bold text-sm">Seguro e Confiável</p>
              </div>
            </div>

            {/* O que você vai receber */}
            <div className="bg-gradient-to-r from-red-600/30 to-orange-600/30 border-2 border-red-500 rounded-lg p-6 mb-8 backdrop-blur-sm">
              <h3 className="text-white text-xl font-black mb-4 text-center">
                ✨ O que você vai receber:
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-white">
                  <span className="text-green-400 text-xl flex-shrink-0">✓</span>
                  <span className="font-semibold">Numerologia Completa - Descubra seu propósito de vida</span>
                </li>
                <li className="flex items-start gap-3 text-white">
                  <span className="text-green-400 text-xl flex-shrink-0">✓</span>
                  <span className="font-semibold">Mapa Astral Detalhado - Conheça suas energias planetárias</span>
                </li>
                <li className="flex items-start gap-3 text-white">
                  <span className="text-green-400 text-xl flex-shrink-0">✓</span>
                  <span className="font-semibold">Limpeza Espiritual - Ritual personalizado para você</span>
                </li>
                <li className="flex items-start gap-3 text-white">
                  <span className="text-green-400 text-xl flex-shrink-0">✓</span>
                  <span className="font-semibold">PDF Personalizado - Seu nome e data de nascimento</span>
                </li>
              </ul>
            </div>

            {/* Botão principal de compra */}
            <button
              onClick={handleComprar}
              className="w-full py-6 px-6 bg-gradient-to-r from-red-600 via-red-700 to-red-600 hover:from-red-700 hover:via-red-800 hover:to-red-700 text-white font-black text-xl rounded-lg shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border-2 border-red-400 uppercase tracking-wide mb-4"
            >
              🔥 Garantir Minha Vaga Agora - R$ 97,00
            </button>

            {/* Garantias */}
            <div className="bg-black/50 border-2 border-green-500 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="text-3xl">🛡️</span>
                <h3 className="text-white text-lg font-black">Garantia de 7 Dias</h3>
              </div>
              <p className="text-gray-300 text-sm text-center font-semibold">
                Se não ficar satisfeito, devolvemos 100% do seu dinheiro. Sem perguntas.
              </p>
            </div>

            {/* Depoimentos rápidos */}
            <div className="space-y-4 mb-8">
              <div className="bg-black/50 border-2 border-yellow-500/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
                </div>
                <p className="text-gray-300 text-sm italic mb-2">
                  &quot;Incrível! Tudo que estava escrito fez total sentido na minha vida. Recomendo!&quot;
                </p>
                <p className="text-gray-500 text-xs font-semibold">- Maria S.</p>
              </div>
              <div className="bg-black/50 border-2 border-yellow-500/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
                </div>
                <p className="text-gray-300 text-sm italic mb-2">
                  &quot;Recebi na hora e o conteúdo é muito completo. Valeu cada centavo!&quot;
                </p>
                <p className="text-gray-500 text-xs font-semibold">- João P.</p>
              </div>
            </div>

            {/* Botão secundário */}
            <button
              onClick={handleComprar}
              className="w-full py-5 px-6 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-lg font-black rounded-lg transition-all transform hover:scale-105 shadow-2xl uppercase tracking-wide border-2 border-orange-400"
            >
              🎯 Aproveitar Desconto Black Friday
            </button>

            {/* Aviso de urgência */}
            <div className="mt-6 text-center">
              <p className="text-red-300 text-sm font-bold animate-pulse">
                ⚠️ Apenas {mounted ? Math.floor(Math.random() * 15) + 5 : 12} vagas restantes!
              </p>
            </div>

            {/* Informação adicional */}
            <div className="mt-8 pt-6 border-t-2 border-red-900">
              <p className="text-gray-400 text-sm text-center font-semibold">
                🔒 Pagamento 100% seguro via Kiwify | ⚡ Acesso imediato após aprovação
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm font-semibold">
              © 2024 ATB Tarot - Todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
