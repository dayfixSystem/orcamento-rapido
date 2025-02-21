"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Stepper from "@keyvaluesystems/react-stepper";

interface Marca {
  id: number;
  nome: string;
}

interface Reparo {
  id: number;
  nome: string;
}

interface Aparelho {
  id: number;
  nome: string;
}

const OrcamentoPage = () => {
  const [marcas, setMarcas] = useState<Marca[]>([]);

  const [aparelhos, setAparelhos] = useState<Aparelho[]>([]);
  const [reparosAtivos, setReparosAtivos] = useState<Reparo[]>([]);
  const [reparosSelecionados, setReparosSelecionados] = useState<number[]>([]);
  const [aparelhoSelecionado, setAparelhoSelecionado] = useState<number | null>(
    null
  );
  const [cep, setCep] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [orcamento, setOrcamento] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingAparelhos, setLoadingAparelhos] = useState(false);

  const [marcaSelecionada, setMarcaSelecionada] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const passosMacro = ["Diagnóstico", "Orçamento", "Confirmação", "Pagamento"];

  // Fetch inicial de marcas e reparos
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const marcasRes = await axios.get("/api/marcas");
        const reparosRes = await axios.get("/api/reparos");
        setMarcas(marcasRes.data);
        setReparosAtivos(reparosRes.data);
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Buscar aparelhos com base na marca selecionada
  const fetchAparelhos = async (marca: string) => {
    setLoadingAparelhos(true);
    try {
      const response = await axios.get(`/api/aparelhos?marca=${marca}`);
      setAparelhos(response.data);
    } catch (error) {
      console.error("Erro ao buscar aparelhos:", error);
    } finally {
      setLoadingAparelhos(false);
    }
  };

  // Consultar CEP
  const buscarCep = async () => {
    try {
      const response = await axios.get(`/api/cep?cep=${cep}`);
      setBairro(response.data.bairro);
      setCidade(response.data.localidade);
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  };

  // Gerar orçamento
  const gerarOrcamento = async () => {
    setError(null); // Resetar erro
    try {
      const payload = {
        reparos: reparosSelecionados,
        aparelho: aparelhoSelecionado,
        bairro,
        cidade,
        cep,
      };

      const response = await axios.post("/api/orcamento", payload);
      setOrcamento(response.data);
    } catch (err: any) {
      console.log(err);

      if (err.response && err.response.data) {
        setError(err.response.data.error || "Erro ao gerar orçamento.");
      } else {
        setError("Erro inesperado ao gerar orçamento.");
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gray-200 px-6 py-4 flex bg-gray-100 items-center justify-between shadow">
        <div className="flex items-center space-x-4">
          <span className="font-bold text-purple-600 text-xl">DAY FIX</span>
          <span className="text-gray-600">| Orçamento Rápido</span>
        </div>
      </header>

      {/* Linha de Progresso Segmentada */}
      <div className="mt-20 max-w-lg mx-auto px-6">
        <div className="relative flex items-center justify-between w-full">
          {passosMacro.map((passo, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              {/* Linha entre os passos */}
              {
                <div
                  className={`h-1 w-full transition-all duration-500 ml-1 ${
                    index == currentStep ? "bg-purple-500" : "bg-gray-300"
                  }`}
                ></div>
              }
            </div>
          ))}
        </div>
      </div>

      {/* Container */}
      <div className=" p-6">
        <h1 className="text-2xl font-bold">Diagnóstico do aparelho</h1>
        <p className="text-gray-600 text-sm mt-2">
          Preencha as informações sobre o problema do seu aparelho para que
          possamos analisar, apresentar o orçamento e iniciar o reparo de forma
          rápida e eficiente.
        </p>

        <Stepper
            steps={[
              {
                stepLabel: "Step 1",
                stepDescription: "This is Step 1",
                completed: true,
              },
              {
                stepLabel: "Step 2",
                stepDescription: "This is Step 2",
                completed: false,
              },
              {
                stepLabel: "Step 3",
                stepDescription: "This is Step 3",
                completed: false,
              },
            ]}
            currentStepIndex={1}
          />


      </div>
    </div>

    // <div className="p-6 max-w-4xl mx-auto">
    //   <h1 className="text-2xl font-bold mb-4">Orçamento</h1>

    //   {/* Exibir Erro */}
    //   {error && (
    //     <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
    //       <strong className="font-bold">Erro:</strong> <span>{error}</span>
    //     </div>
    //   )}

    //   {/* Marca */}
    //   <div className="mb-6">
    //     <h2 className="text-lg font-semibold">1. Selecione a Marca</h2>
    //     {loading ? (
    //       <Skeleton className="h-10 w-full" />
    //     ) : (
    //       <Select onValueChange={(value) => fetchAparelhos(value)}>
    //         <SelectTrigger className="w-full">
    //           <span>Selecione</span>
    //         </SelectTrigger>
    //         <SelectContent>
    //           {marcas.map((marca) => (
    //             <SelectItem key={marca.id} value={marca.nome}>
    //               {marca.nome}
    //             </SelectItem>
    //           ))}
    //         </SelectContent>
    //       </Select>
    //     )}
    //   </div>

    //   {/* Aparelho */}
    //   <div className="mb-6">
    //     <h2 className="text-lg font-semibold">2. Selecione o Aparelho</h2>
    //     {loadingAparelhos ? (
    //       <Skeleton className="h-10 w-full" />
    //     ) : (
    //       <Select onValueChange={(value) => setAparelhoSelecionado(Number(value))}>
    //         <SelectTrigger className="w-full">
    //           <span>Selecione</span>
    //         </SelectTrigger>
    //         <SelectContent>
    //           {aparelhos.map((aparelho) => (
    //             <SelectItem key={aparelho.id} value={String(aparelho.id)}>
    //               {aparelho.nome}
    //             </SelectItem>
    //           ))}
    //         </SelectContent>
    //       </Select>
    //     )}
    //   </div>

    //   {/* Reparos */}
    //   <div className="mb-6">
    //     <h2 className="text-lg font-semibold">3. Selecione os Reparos</h2>
    //     {reparosAtivos.map((reparo) => (
    //       <div key={reparo.id} className="flex items-center">
    //         <input
    //           type="checkbox"
    //           id={`reparo-${reparo.id}`}
    //           onChange={() =>
    //             setReparosSelecionados((prev) =>
    //               prev.includes(reparo.id)
    //                 ? prev.filter((id) => id !== reparo.id)
    //                 : [...prev, reparo.id]
    //             )
    //           }
    //         />
    //         <label htmlFor={`reparo-${reparo.id}`} className="ml-2">
    //           {reparo.nome}
    //         </label>
    //       </div>
    //     ))}
    //   </div>

    //   {/* CEP */}
    //   <div className="mb-6">
    //     <h2 className="text-lg font-semibold">4. Informe o CEP</h2>
    //     <Input
    //       value={cep}
    //       onChange={(e) => setCep(e.target.value)}
    //       placeholder="CEP"
    //       className="w-full mb-2"
    //     />
    //     <Button onClick={buscarCep}>Buscar CEP</Button>
    //     {bairro && cidade && (
    //       <p className="mt-2">
    //         Bairro: {bairro}, Cidade: {cidade}
    //       </p>
    //     )}
    //   </div>

    //   {/* Gerar Orçamento */}
    //   <div className="mb-6">
    //     <h2 className="text-lg font-semibold">5. Gerar Orçamento</h2>
    //     <Button onClick={gerarOrcamento}>Gerar</Button>
    //   </div>

    //   {/* Resultado */}
    //   {orcamento && (
    //     <div className="mt-6">
    //       <h2 className="text-xl font-bold">Resultado do Orçamento</h2>
    //       <p>Valor Total: {orcamento.valor_total}</p>
    //       <p>Detalhes:</p>
    //       <ul className="list-disc pl-5">
    //         <li>Custo das Peças: {orcamento.detalhes.custo_pecas}</li>
    //         <li>Acréscimo: {orcamento.detalhes.acrescimo}</li>
    //       </ul>
    //     </div>
    //   )}
    // </div>
  );
};

export default OrcamentoPage;
