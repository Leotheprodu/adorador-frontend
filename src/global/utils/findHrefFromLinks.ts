import { links } from '../config/links';

export const findHrefFromLinks = (name: string): string => {
  return (
    links.find((link) => {
      return link.name === name;
    })?.href || '/'
  );
};
