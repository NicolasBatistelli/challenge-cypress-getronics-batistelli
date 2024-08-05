import TiendaPage from '../support/pages/TiendaPage';

describe('CP001 - Validar cuotas en compra de equipo', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false});
  });

  it('Verifica 3 cuotas sin interés para el equipo A14', () => {
    TiendaPage.visitar();
    cy.url().should('include', 'tiendaonline.movistar.com.ar');

    TiendaPage.buscar('A14');
    
    cy.get('.name').then(($links) => {
      if ($links.text().includes('A14')) {
        TiendaPage.seleccionarProducto('A14');
      } else {
        TiendaPage.seleccionarPrimerProducto();
      }
    });

    TiendaPage.selectBancoYTarjeta("VISA ARGENTINA, S.A.", "Visa");
    TiendaPage.verificarOpcionCuotas(3);

    cy.get('.pdp-payment-modal > .modal-inner-wrap').screenshot();

  });
});