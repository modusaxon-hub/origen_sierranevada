/**
 * Composer de clases Tailwind — alternativa liviana a clsx/classnames.
 * Elimina valores falsy (false, null, undefined) antes de unir.
 */
export const cn = (...classes: (string | boolean | undefined | null)[]): string =>
    classes.filter(Boolean).join(' ');
