export function debounce({ ms }: { ms: number }): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    let timeout: any;

    descriptor.value = function (...args: any[]) {
      const context = this;

      const doLater = () => {
        timeout = null;
        originalMethod.apply(context, args);
      };

      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(doLater, ms);
    };

    return descriptor;
  };
}

export function delay({ ms }: { ms: number }) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      await new Promise((resolve) => setTimeout(resolve, ms)); // Delay execution
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
