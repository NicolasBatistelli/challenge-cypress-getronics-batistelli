import TiendaPage from '../support/pages/TiendaPage';

describe('CP003 - Validar cuotas en compra de equipo', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false});
  });

  it('Verifica que no exista pago en 60 cuotas para Credicoop con VISA', () => {
    TiendaPage.visitar();
    cy.url().should('include', 'tiendaonline.movistar.com.ar');

    TiendaPage.seleccionarProductoEnPosicion(3);

    TiendaPage.selectBancoYTarjeta("Credicoop", "Visa");
    TiendaPage.verificarOpcionCuotas(60);
  });
});