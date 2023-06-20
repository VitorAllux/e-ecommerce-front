import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientesComponent } from './clientes/clientes.component';
import { ProdutosComponent } from './produtos/produtos.component';
import { VendasComponent } from './vendas/vendas.component';

const routes: Routes = [
  { path: '', redirectTo: '/clientes', pathMatch: 'full' },
  { path: 'clientes', component: ClientesComponent },
  { path: 'produtos', component: ProdutosComponent },
  { path: 'vendas', component: VendasComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
