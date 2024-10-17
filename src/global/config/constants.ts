import countryCodesJson from "../data/country-codes.json";

export const appName = "Adorador";
export const Server1API = process.env.PUBLIC_API_URL_1;
export const domain = process.env.NEXT_PUBLIC_DOMAIN;
export const appDescription =
  "Adorador es una plataforma cristiana, con herramientas para la iglesia";
export const userRoles = {
  Admin: {
    id: 1,
    name: "admin",
  },
  User: {
    id: 2,
    name: "user",
  },
};
export const countryCodes: {
  country: string;
  code: string;
  currency: string;
  langCountry: string;
}[] = countryCodesJson;

export const translates = {
  active: "Activo",
  inactive: "Inactivo",
};
