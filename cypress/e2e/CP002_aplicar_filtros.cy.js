import TiendaPage from '../support/pages/TiendaPage';

describe('CP002 - Aplicar filtro de equipos', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false});
  });

  it('Filtra por Memoria Interna 128GB y precio entre $200K y $300K', () => {
    TiendaPage.visitar();
    cy.url().should('include', 'tiendaonline.movistar.com.ar');

    TiendaPage.aplicarFiltroMemoria('128GB');
    TiendaPage.aplicarFiltroPrecio(200000, 300000);

    cy.get('.selectedfilters').should('be.visible');
    cy.wait(5000);
    cy.get('.page-wrapper').screenshot();

    TiendaPage.obtenerCantidadProductos();
  });
});