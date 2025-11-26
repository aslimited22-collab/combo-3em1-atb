'use client';

import { useState, useEffect } from 'react';

export default function ProdutoPage() {
  const [nome, setNome] = useState('');
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultado, setResultado] = useState<string | null>(null);
  const [comboGerado, setComboGerado] = useState(false);

  // Verificar se já foi gerado um combo (localStorage)
  useEffect(() => {
    const jaGerou = localStorage.getItem('combo_gerado');
    if (jaGerou === 'true') {
      setComboGerado(true);
    }
  }, []);

  const handleGerarCombo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar se já gerou um combo
    if (comboGerado) {
      setError('Você já gerou seu combo! Apenas uma geração é permitida.');
      return;
    }

    setError('');
    setLoading(true);
    setResultado(null);

    try {
      // Gerar o combo
      const response = await fetch('/api/gerar-combo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          nome, 
          data, 
          email: 'teste@desenvolvimento.com' 
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar o combo');
      }

      // Receber o JSON com HTML
      const result = await response.json();
      
      if (!result.html) {
        throw new Error('HTML não foi gerado corretamente');
      }

      // Exibir o resultado na tela
      setResultado(result.html);
      
      // Marcar como gerado no localStorage
      localStorage.setItem('combo_gerado', 'true');
      setComboGerado(true);
      
    } catch (err) {
      console.error('Erro:', err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro ao gerar seu combo. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleBaixarCombo = () => {
    if (!resultado) return;

    // Criar um blob com o HTML e fazer download
    const blob = new Blob([resultado], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `combo-3-em-1-${nome.replace(/\s+/g, '-').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Se já gerou e tem resultado, mostrar preview
  if (resultado) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-red-950/20 to-black"></div>
        
        <div className="relative z-10 p-4">
          {/* Barra de ações */}
          <div className="max-w-7xl mx-auto mb-4 flex flex-wrap gap-4 justify-between items-center bg-gray-900 p-4 rounded-lg border-2 border-green-500">
            <h2 className="text-white text-xl font-bold">✅ Seu Combo foi Gerado!</h2>
            <div className="flex gap-3">
              <button
                onClick={handleBaixarCombo}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg transition-all"
              >
                📥 Baixar Combo
              </button>
            </div>
          </div>

          {/* Aviso de limite */}
          <div className="max-w-7xl mx-auto mb-4 bg-yellow-600/20 border-2 border-yellow-500 rounded-lg p-4 text-center">
            <p className="text-yellow-200 text-sm font-semibold">
              ⚠️ Você já utilizou sua geração única. Não é possível gerar outro combo.
            </p>
          </div>

          {/* Preview do resultado */}
          <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-2xl overflow-hidden border-4 border-green-500">
            <div 
              dangerouslySetInnerHTML={{ __html: resultado }}
              className="w-full"
            />
          </div>
        </div>
      </div>
    );
  }

  // Se já gerou mas não tem resultado (refresh), mostrar mensagem
  if (comboGerado && !resultado) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-red-950/20 to-black"></div>
        
        <div className="relative z-10 max-w-2xl w-full bg-gradient-to-b from-gray-900 to-black rounded-2xl p-8 md:p-12 shadow-2xl border-4 border-yellow-500 text-center">
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
            Limite Atingido
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            Você já gerou seu combo anteriormente. Apenas uma geração é permitida por pessoa.
          </p>
          <div className="bg-yellow-600/20 border-2 border-yellow-500 rounded-lg p-4">
            <p className="text-yellow-200 text-sm font-semibold">
              Se você precisa de outro combo, entre em contato com o suporte.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Formulário inicial
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-red-950/20 to-black"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZjAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl">
          {/* Header de boas-vindas */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-t-2xl p-6 text-center border-4 border-purple-500">
            <div className="text-5xl mb-3">✨</div>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wider mb-2">
              Combo Espiritual 3 em 1
            </h2>
            <p className="text-purple-100 text-lg font-semibold">
              Sua jornada de autoconhecimento começa aqui
            </p>
          </div>

          {/* Card principal */}
          <div className="bg-gradient-to-b from-gray-900 to-black rounded-b-2xl p-8 md:p-12 shadow-2xl border-x-4 border-b-4 border-purple-500">
            {/* Cabeçalho */}
            <div className="text-center mb-8">
              <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold uppercase mb-4">
                🎁 Uma Geração Única
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                Gere Seu Combo Personalizado
              </h1>
              <p className="text-gray-300 text-lg md:text-xl font-semibold">
                Numerologia + Mapa Astral + Limpeza Espiritual
              </p>
            </div>

            {/* Instruções */}
            <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-2 border-purple-500 rounded-lg p-6 mb-8 backdrop-blur-sm">
              <h3 className="text-white text-lg font-black mb-3 text-center">
                📋 Como funciona:
              </h3>
              <ol className="space-y-2 text-white">
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 font-black flex-shrink-0">1.</span>
                  <span className="font-semibold">Preencha seu nome completo e data de nascimento</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 font-black flex-shrink-0">2.</span>
                  <span className="font-semibold">Clique em "Gerar Meu Combo"</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 font-black flex-shrink-0">3.</span>
                  <span className="font-semibold">Visualize e baixe seu combo personalizado</span>
                </li>
              </ol>
            </div>

            {/* Aviso importante */}
            <div className="bg-yellow-600/20 border-2 border-yellow-500 rounded-lg p-4 mb-6 text-center">
              <p className="text-yellow-200 text-sm font-semibold">
                ⚠️ ATENÇÃO: Você pode gerar apenas UM combo. Escolha com cuidado!
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleGerarCombo} className="space-y-6">
              {/* Campo Nome */}
              <div>
                <label htmlFor="nome" className="block text-sm font-bold text-white mb-2 uppercase tracking-wide">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  disabled={comboGerado}
                  className="w-full px-4 py-4 bg-black/50 border-2 border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Digite seu nome completo"
                />
              </div>

              {/* Campo Data de Nascimento */}
              <div>
                <label htmlFor="data" className="block text-sm font-bold text-white mb-2 uppercase tracking-wide">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  id="data"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  required
                  disabled={comboGerado}
                  className="w-full px-4 py-4 bg-black/50 border-2 border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Mensagem de erro */}
              {error && (
                <div className="bg-red-600/20 border-2 border-red-500 rounded-lg p-4 backdrop-blur-sm">
                  <p className="text-red-200 text-sm font-semibold">{error}</p>
                </div>
              )}

              {/* Botão de submit */}
              <button
                type="submit"
                disabled={loading || comboGerado}
                className="w-full py-5 px-6 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 disabled:from-gray-700 disabled:to-gray-700 text-white font-black text-lg rounded-lg shadow-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed border-2 border-purple-400 uppercase tracking-wide"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Gerando seu combo...
                  </span>
                ) : comboGerado ? (
                  '🔒 Limite Atingido'
                ) : (
                  '✨ Gerar Meu Combo 3 em 1 Agora'
                )}
              </button>
            </form>

            {/* Informação adicional */}
            <div className="mt-8 pt-6 border-t-2 border-purple-900">
              <p className="text-gray-400 text-sm text-center font-semibold">
                ⚡ Você verá o resultado na tela e poderá baixar quando quiser
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
