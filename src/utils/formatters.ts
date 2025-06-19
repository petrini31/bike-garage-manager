
export const formatCPF = (value: string) => {
  // Remove tudo que não é dígito
  const digits = value.replace(/\D/g, '')
  
  if (digits.length <= 11) {
    // Formatar como CPF: xxx.xxx.xxx-xx
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
  } else {
    // Formatar como CNPJ: xx.xxx.xxx/xxxx-xx
    return digits
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})/, '$1-$2')
  }
}

export const formatPhone = (value: string) => {
  // Remove tudo que não é dígito
  const digits = value.replace(/\D/g, '')
  
  // Formatar como (xx) xxxxx-xxxx
  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})/, '$1-$2')
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}
