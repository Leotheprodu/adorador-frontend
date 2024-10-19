'use client';
import React, { useEffect } from 'react';
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PayPal: any;
  }
}
export const PaypalDonationButton = () => {
  useEffect(() => {
    // Verifica si el script ya existe
    const existingScript = document.querySelector(
      'script[src="https://www.paypalobjects.com/donate/sdk/donate-sdk.js"]',
    );

    if (!existingScript) {
      // Si el script no existe, lo añadimos
      const script = document.createElement('script');
      script.src = 'https://www.paypalobjects.com/donate/sdk/donate-sdk.js';
      script.setAttribute('charset', 'UTF-8');
      script.onload = () => {
        // Renderiza el botón de donación una vez que el script se haya cargado
        renderPaypalButton();
      };
      document.body.appendChild(script);
    } else {
      // Si el script ya está cargado, renderiza el botón directamente
      renderPaypalButton();
    }
  }, []); // El array vacío asegura que esto solo ocurre una vez

  const renderPaypalButton = () => {
    if (
      window.PayPal &&
      document.getElementById('donate-button')?.children.length === 0
    ) {
      // Solo renderizamos si el contenedor está vacío
      window.PayPal.Donation.Button({
        env: 'production',
        hosted_button_id: 'P8VJXU5CHT3N8', // ID de tu botón
        image: {
          src: 'https://www.paypalobjects.com/webstatic/mktg/logo-center/logotipo_paypal_pagos_seguros.png',
          alt: 'Donar con el botón PayPal',
          title: 'PayPal - The safer, easier way to pay online!',
        },
      }).render('#donate-button');
    }
  };
  return (
    <div className="flex items-center justify-center transition-all duration-200 hover:opacity-80">
      <div id="donate-button"></div>
    </div>
  );
};
