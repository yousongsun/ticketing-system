declare module '@/lib/utils' {
  export function cn(
    ...args: (string | number | boolean | undefined | null | object)[]
  ): string;
}
