'use client';

import { useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const CadastroClientePage = () => {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    celular: '',
    cep: '',
    endereco: '',
    cidade: '',
    bairro: '',
    uf: '',
    numero: '',
    complemento: '',
  });

  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Atualiza os valores dos inputs conforme o usuário digita
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Se o campo alterado for o CEP, buscar endereço
    if (e.target.name === 'cep' && e.target.value.length === 8) {
      buscarEndereco(e.target.value);
    }
  };

  // Função para buscar endereço via API externa ao digitar o CEP
  const buscarEndereco = async (cep: string) => {
    setLoadingCep(true);
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (response.data.erro) {
        throw new Error('CEP não encontrado');
      }
      setFormData({
        ...formData,
        endereco: response.data.logradouro,
        bairro: response.data.bairro,
        cidade: response.data.localidade,
        uf: response.data.uf,
      });
    } catch (error) {
      setErrorMessage('CEP inválido ou não encontrado.');
    } finally {
      setLoadingCep(false);
    }
  };

  // Enviar os dados do cliente para a API de cadastro
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await axios.post('/api/clientes', formData);
      setSuccessMessage('Cliente cadastrado com sucesso!');
      setFormData({
        nome: '',
        cpf: '',
        email: '',
        celular: '',
        cep: '',
        endereco: '',
        cidade: '',
        bairro: '',
        uf: '',
        numero: '',
        complemento: '',
      });
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Erro ao cadastrar cliente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Cadastro de Cliente</h1>

      {successMessage && <div className="bg-green-100 text-green-700 p-3 rounded">{successMessage}</div>}
      {errorMessage && <div className="bg-red-100 text-red-700 p-3 rounded">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome" required />
        <Input name="cpf" value={formData.cpf} onChange={handleChange} placeholder="CPF" required />
        <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <Input name="celular" value={formData.celular} onChange={handleChange} placeholder="Celular" required />

        {/* CEP - Busca automática ao completar 8 dígitos */}
        <Input
          name="cep"
          value={formData.cep}
          onChange={handleChange}
          placeholder="CEP"
          required
        />
        {loadingCep && <Skeleton className="h-6 w-full" />}

        {/* Endereço preenchido automaticamente */}
        <Input name="endereco" value={formData.endereco} onChange={handleChange} placeholder="Endereço" required />
        <Input name="bairro" value={formData.bairro} onChange={handleChange} placeholder="Bairro" required />
        <Input name="cidade" value={formData.cidade} onChange={handleChange} placeholder="Cidade" required />
        <Input name="uf" value={formData.uf} onChange={handleChange} placeholder="UF" required />
        <Input name="numero" value={formData.numero} onChange={handleChange} placeholder="Número" required />
        <Input name="complemento" value={formData.complemento} onChange={handleChange} placeholder="Complemento" />

        <Button type="submit" disabled={loading}>
          {loading ? <Skeleton className="h-6 w-full" /> : 'Cadastrar'}
        </Button>
      </form>
    </div>
  );
};

export default CadastroClientePage;
