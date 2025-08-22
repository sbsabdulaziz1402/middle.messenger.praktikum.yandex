export type ValidationResult = {
  isValid: boolean;
  error: string;
};

const patterns: Record<string, RegExp> = {
  first_name: /^[A-ZА-Я][a-zа-я-]*$/,
  second_name: /^[A-ZА-Я][a-zа-я-]*$/,
  login: /^(?!\d+$)[A-Za-z0-9_-]{3,20}$/,
  email: /^[A-Za-z0-9._-]+@[A-Za-z]+\.[A-Za-z]+$/,
  password: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,40}$/,
  phone: /^\+?\d{10,15}$/,
  message: /^(?!\s*$).+$/,
};

const errorMessages: Record<string, string> = {
  first_name:
    "Имя должно начинаться с заглавной буквы, без пробелов и цифр, допустим только дефис.",
  second_name:
    "Фамилия должна начинаться с заглавной буквы, без пробелов и цифр, допустим только дефис.",
  login:
    "Логин 3–20 символов, латиница, можно цифры, дефис, подчёркивание, но не только цифры.",
  email: "Неверный формат email.",
  password:
    "Пароль 8–40 символов, минимум одна заглавная буква и цифра.",
  phone: "Телефон от 10 до 15 цифр, может начинаться с +.",
  message: "Сообщение не может быть пустым.",
};

export function validateField(name: string, value: string): ValidationResult {
  const pattern = patterns[name];
  if (!pattern) {
    return { isValid: true, error: "" };
  }
  const isValid = pattern.test(value);
  return { isValid, error: isValid ? "" : errorMessages[name] };
}

export function validateForm(values: Record<string, string>) {
  const errors: Record<string, string> = {};
  let isFormValid = true;

  for (const [name, value] of Object.entries(values)) {
    const { isValid, error } = validateField(name, value);
    if (!isValid) {
      isFormValid = false;
      errors[name] = error;
    }
  }

  return { isFormValid, errors };
}
