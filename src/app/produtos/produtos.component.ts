import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ApiService } from '../api.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css']
})
export class ProdutosComponent implements OnInit {

  produtos: any;
  produtoForm: FormGroup;
  filtro: any = { produto_descricao: null }
  selectedProduto: any = { id: '', descricao: '', valor: '', quantidade: '' };
  selectedProdutoVoid: any = { id: '', descricao: '', valor: '', quantidade: '' };

  constructor(private apiService: ApiService, private formBuilder: FormBuilder, private appComponent: AppComponent) {
    this.produtoForm = this.formBuilder.group({
      id: [''],
      descricao: [''],
      valor: [''],
      quantidade: ['']
    });
  }

  ngOnInit(): void {
    this.getProdutos();
  }

  getProdutos(): void {
    this.apiService.getProdutos().subscribe((data) => {
      if (this.filtro.produto_descricao) {
        data = data.filter((produto: { descricao: any; }) => this.compareStrings(produto.descricao, this.filtro.produto_descricao))
      }

      this.produtos = data;
    });
  }

  createOrUpdateProduto(): void {
    console.log(this.produtoForm);
    if (this.selectedProduto && this.selectedProduto.id) {
      this.apiService.updateProduto(this.produtoForm.value.id, this.produtoForm.value).subscribe(
        () => {
          this.appComponent.showSuccess('Produto atualizado com sucesso.');
          this.getProdutos();
        },
        (error) => {
          this.appComponent.showError('Erro ao atualizar o produto. Verifique se o ID já existe.');
        }
      );
    } else {
      this.apiService.createProduto(this.produtoForm.value).subscribe(
        () => {
          this.appComponent.showSuccess('Produto criado com sucesso.');
          this.getProdutos();
        },
        (error) => {
          this.appComponent.showError('Erro ao criar o produto. Verifique se o ID já existe.');
        }
      );
    }
    this.clearForm();
  }

  selectProduto(produto: any): void {
    console.log(produto);
    this.selectedProduto = produto;
    this.produtoForm.setValue({
      id: this.selectedProduto.id,
      descricao: this.selectedProduto.descricao,
      valor: this.selectedProduto.valor,
      quantidade: this.selectedProduto.quantidade
    });
  }

  deleteProduto(id: any): void {
    this.apiService.deleteProduto(id).subscribe(
      () => {
        this.appComponent.showSuccess('Produto excluído com sucesso.');
        this.getProdutos();
      },
      (error) => {
        this.appComponent.showError('Erro ao excluir o produto.');
      }
    );
    this.clearForm();
  }

  clearForm(): void {
    this.produtoForm.reset();
  }

  unacentLowerCase(string: string): string {
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  compareStrings(produtoNome: string = '', filtroString: string = ''): boolean {
    return this.unacentLowerCase(produtoNome).includes(this.unacentLowerCase(filtroString));
  }

  limparFiltros(): void {
    this.filtro.produto_descricao = null;
    this.getProdutos();
  }

}
