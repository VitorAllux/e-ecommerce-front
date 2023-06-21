import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ApiService } from '../api.service';
import { AppComponent } from '../app.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vendas',
  templateUrl: './vendas.component.html',
  styleUrls: ['./vendas.component.css']
})
export class VendasComponent implements OnInit {

  vendas: any;
  vendaForm: FormGroup;
  produtos: any;
  clientes: any;

  filtro: any = { produto_id: null, cliente_id: null, periodoVenda: { menorIgual: null, maiorIgual: null } }
  filtroVoid: any = { produto_id: null, cliente_id: null, periodoVenda: { menorIgual: null, maiorIgual: null } }

  selectedVenda: any = { id: '', cliente_id: '', produto_id: '', quantidade: '', valor: '' };
  selectedVendaVoid: any = { id: '', cliente_id: '', produto_id: '', quantidade: '', valor: '' };

  constructor(private apiService: ApiService, private formBuilder: FormBuilder, private appComponent: AppComponent, private toastr: ToastrService) {
    this.vendaForm = this.formBuilder.group({
      id: [''],
      cliente_id: [''],
      produto_id: [''],
      quantidade: [''],
      valor: ['']
    });
  }

  private carregaRecursos(): void {
    this.apiService.getProdutos().subscribe((data) => {
      this.produtos = data;
    });

    this.apiService.getClientes().subscribe((data) => {
      this.clientes = data;
    });
  }

  buscaCliente(id:number ): string{
    return this?.clientes?.find((cliente: { id: any; }) => cliente.id === id).nome
  }

  buscaProduto(id:number ): string{
    return this?.produtos?.find((produto: { id: any; }) => produto.id === id).descricao
  }

  ngOnInit(): void {
    this.getVendas();
    this.carregaRecursos();
  }

  getVendas(): void {
    this.apiService.getVendas().subscribe((data) => {
      if (this.filtro.produto_id) {
        data = data.filter((venda: { produto_id: any; }) => venda.produto_id == this.filtro.produto_id)
      }

      if (this.filtro.cliente_id) {
        data = data.filter((venda: { cliente_id: any; }) => venda.cliente_id == this.filtro.cliente_id)
      }

      if (this.filtro.periodoVenda.maiorIgual) {
        data = data.filter((venda: { created_at: any; }) => venda.created_at.split("T")[0] >= this.filtro.periodoVenda.maiorIgual)
      }

      if (this.filtro.periodoVenda.menorIgual) {
        data = data.filter((venda: { created_at: any; }) => venda.created_at.split("T")[0] <= this.filtro.periodoVenda.menorIgual)
      }

      this.vendas = data;
    });
  }

  createOrUpdateVenda(): void {
    console.log(this.vendaForm);
    if (this.selectedVenda && this.selectedVenda.id) {
      this.apiService.updateVenda(this.vendaForm.value.id, this.vendaForm.value).subscribe(
        () => {
          this.appComponent.showSuccess('Venda atualizada com sucesso.');
          this.getVendas();
        },
        (error) => {
          this.appComponent.showError('Erro ao atualizar a venda. Verifique se o ID já existe.');
        }
      );
    } else {
      if(this.temEstoque()){
        this.apiService.createVenda(this.vendaForm.value).subscribe(
          () => {
            this.appComponent.showSuccess('Venda criada com sucesso.');
            this.getVendas();
          },
          (error) => {
            this.appComponent.showError('Erro ao criar a venda. Verifique se o ID já existe.');
          }
        );
      } else {
        this.toastr.error("O estoque do produto é menor que o solicitado")
      }

    }
    this.clearForm();
  }

  selectVenda(venda: any): void {
    console.log(venda);
    this.selectedVenda = venda;
    this.vendaForm.setValue({
      id: this.selectedVenda.id,
      cliente_id: this.selectedVenda.cliente_id,
      produto_id: this.selectedVenda.produto_id,
      quantidade: this.selectedVenda.quantidade,
      valor: this.selectedVenda.valor
    });
  }

  deleteVenda(id: any): void {
    this.apiService.deleteVenda(id).subscribe(
      () => {
        this.appComponent.showSuccess('Venda excluída com sucesso.');
        this.getVendas();
      },
      (error) => {
        this.appComponent.showError('Erro ao excluir a venda.');
      }
    );
    this.clearForm();
  }

  clearForm(): void {
    this.vendaForm.reset();
  }

  limparFiltros(): void {
    this.filtro = this.filtroVoid;
    this.filtro.periodoVenda.maiorIgual = null
    this.filtro.periodoVenda.menorIgual = null
    this.getVendas();
  }

  temEstoque(): boolean{
    if(this.vendaForm.value.quantidade){
      let produto = this.produtos.find((prod: { id: any; }) => prod.id === this.vendaForm.value.produto_id)
    
      if(produto){
        return produto.quantidade >= this.vendaForm.value.quantidade
      }
    }
    return false
  }

  calculaValor(){
    if(this.vendaForm.value.produto_id && this.vendaForm.value.quantidade){
      let produto = this.produtos.find((prod: { id: any; }) => prod.id === this.vendaForm.value.produto_id)
    
      if(produto){
        this.vendaForm.value.valor = (this.vendaForm.value.quantidade * produto.valor);
      }
    }
  }
}


