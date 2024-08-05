class TiendaPage {

    visitar() {
        cy.visit('https://tiendaonline.movistar.com.ar');
    }

    buscar(consulta) {
        cy.get('#search_action').click({ force: true });
        cy.get('#search').should('be.visible').type(`${consulta}{enter}`);
    }

    seleccionarProducto(nombreProducto) {
        cy.get('.product-link').contains(nombreProducto).click();
    }

    seleccionarPrimerProducto() {
        cy.get('.content-products ol > li > a').first().click();
    }

    seleccionarProductoEnPosicion(n) {
        cy.get('.products .product-item').eq(n - 1).find('a[data-element-ga="link"]').click();
    }

    selectBancoYTarjeta(banco, tarjeta) {
        cy.get('#open-installments-modal').click();
        cy.get('#selectBank').click({ force: true });
        cy.get('#selectBank #ui-id-2 .ui-menu-item').contains(banco).click({ force: true });
        cy.get('#cardSelector').click({ force: true });
        cy.get('#cardSelector').find(`li[data-card="${tarjeta}"]`).click({ force: true });
        cy.get('#calculate_btn').find('.btn-primary').click();
    }

    verificarOpcionCuotas(cuotas) {
        cy.get('#installmentsTable', { timeout: 10000 }).should('be.visible').then($body => {
            if ($body.find(`:contains("${cuotas} cuotas sin interés")`).length > 0) {
                cy.log(`Se encontró la opción de ${cuotas} cuotas sin interés.`);
            } else {
                throw new Error(`No se encontró la opción de ${cuotas} cuotas sin interés.`);
            }
        });
    }

    aplicarFiltroMemoria(memoria) {
        cy.get('[data-role="collapsible"][class="filter-item memory"]').click();
        cy.get('.filter-content .items[data-code="movistar_internalmemory"] li')
            .contains(memoria)
            .click();
    }

    aplicarFiltroPrecio(precioMinimo, precioMaximo) {
        cy.get('[data-role="collapsible"][class="filter-item price active"]').click();
        cy.get('.filter-content .items[data-code="price"] li').should('be.visible');

        let mejorCoincidencia = null;
        let mejorSolapamiento = 0;

        cy.get('.filter-content .items[data-code="price"] li')
            .each(($el) => {
                const textoRango = $el.text().trim();
                let [min, max] = textoRango.split('-').map(s => parseInt(s.replace(/\D/g, '')));

                if (textoRango.includes('y superior')) {
                    max = Infinity;
                }

                const inicioSolapamiento = Math.max(min, precioMinimo);
                const finSolapamiento = Math.min(max, precioMaximo);
                const solapamiento = Math.max(0, finSolapamiento - inicioSolapamiento);

                if (solapamiento > mejorSolapamiento || (solapamiento === mejorSolapamiento && min >= precioMinimo)) {
                    mejorSolapamiento = solapamiento;
                    mejorCoincidencia = $el;
                }
            })
            .then(() => {
                if (mejorCoincidencia) {
                    cy.wrap(mejorCoincidencia).click();
                } else {
                    throw new Error('No se encontró un rango de precios adecuado');
                }
            });

        cy.get('.products .product-item', { timeout: 10000 }).should('be.visible');
    }

    obtenerCantidadProductos() {
        return cy.get('.total-products > p').invoke('text').then(texto => {
            let cantidad;
            const coincidenciaCompleta = texto.match(/(\d+) de (\d+)/);
            const coincidenciaUnica = texto.match(/Mostrando (\d+) equipos/);

            if (coincidenciaCompleta) {
                cantidad = parseInt(coincidenciaCompleta[2], 10);
            } else if (coincidenciaUnica) {
                cantidad = parseInt(coincidenciaUnica[1], 10);
            } else {
                cantidad = 0;
            }

            cy.log(`Número de productos encontrados: ${cantidad}`);
        });
    }

    agregarAlCarro() {
        cy.get('#swatch_attribute_card').click();
    }

    static precioEnLimpio(precio) {
        let precioLimpio = precio.replace(/[^\d,]/g, '').replace(',', '.');

        let numero = Math.round(parseFloat(precioLimpio));

        let formateado = numero.toLocaleString('es-AR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });

        return `$ ${formateado}`;
    }

    obtenerNombreProducto() {
        cy.get('.item.product').invoke('text').then((nombreProducto) => {
            const textoRecortado = nombreProducto.trim();
            cy.log(`El nombre del producto es: ${textoRecortado}`);
            cy.wrap(textoRecortado).as('nombreProducto');
        });
    }

    obtenerPrecioProducto() {
        cy.get('.price-wrapper .price').first().invoke('text').then((precioProducto) => {
            const precioRecortado = TiendaPage.precioEnLimpio(precioProducto);
            cy.log(`El precio del producto es: ${precioRecortado}`);
            cy.wrap(precioRecortado).as('precioProducto');
        });
    }


    obtenerNombreProductoCarrito() {
        cy.get('.product-item-name a').first().invoke('text').then((texto) => {
            const textoRecortado = texto.trim();
            cy.log(`El nombre del producto dentro del carrito es: ${textoRecortado}`);
            cy.wrap(textoRecortado).as('nombreProductoCarrito');
        });
    }

    obtenerPrecioProductoCarrito() {
        cy.get('.cart-price .price').first().invoke('text').then((precioProductoCarrito) => {
            const precioLimpio = TiendaPage.precioEnLimpio(precioProductoCarrito);
            cy.log(`El precio del producto en el carrito es: ${precioLimpio}`);
            cy.wrap(precioLimpio).as('precioProductoCarrito');
        });
    }

    obtenerTotalCarrito() {
        cy.get('.grand.totals .price').invoke('text').then((totalCarrito) => {
            const totalLimpio = TiendaPage.precioEnLimpio(totalCarrito);
            cy.log(`El total del carrito es: ${totalLimpio}`);
            cy.wrap(totalLimpio).as('totalCarrito');
        });
    }

    compararValores(alias1, alias2, descripcion) {
        cy.get(`@${alias1}`).then((valor1) => {
            cy.get(`@${alias2}`).then((valor2) => {
                expect(valor2).to.equal(valor1, `${descripcion} deberían coincidir`);
                cy.log(`✅ ${descripcion} coinciden: ${valor1} es igual a ${valor2}`);
            });
        });
    }
}

export default new TiendaPage();