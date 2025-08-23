type ToastOptions = {
  message: string;
  duration?: number;
};

export class ErrorToast {
  private container: HTMLElement;

  constructor() {
    this.container = document.createElement("div");
    this.container.classList.add("error-toast-container");
    document.body.appendChild(this.container);
  }

  show({ message, duration = 2000 }: ToastOptions) {
    const toast = document.createElement("div");
    toast.classList.add("error-toast");
    toast.textContent = message;

    this.container.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, duration);
  }
}
