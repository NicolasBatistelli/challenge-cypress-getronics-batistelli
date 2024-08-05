import TiendaPage from '../support/pages/TiendaPage';

describe('CP004 - Verificar la funcionalidad de agregar un equipo al carrito de compras', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
  });

  it('Agrega un equipo al carrito y verifica que el contenido esté presente', () => {
    TiendaPage.visitar();
    cy.url().should('include', 'tiendaonline.movistar.com.ar');

    TiendaPage.seleccionarPrimerProducto();

    TiendaPage.obtenerNombreProducto();
    TiendaPage.obtenerPrecioProducto();

    TiendaPage.agregarAlCarro();

    TiendaPage.obtenerNombreProductoCarrito();
    TiendaPage.obtenerPrecioProductoCarrito();
    TiendaPage.obtenerTotalCarrito();

    TiendaPage.compararValores('nombreProducto', 'nombreProductoCarrito', 'El nombre del producto');
    TiendaPage.compararValores('precioProducto', 'precioProductoCarrito', 'El precio del producto');
    TiendaPage.compararValores('precioProductoCarrito', 'totalCarrito', 'El total del carrito');

    cy.screenshot();
  });
});