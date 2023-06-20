import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ApiService } from '../api.service';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css']
})
export class ProdutosComponent implements OnInit {

  produtos: any;
  produtoForm: FormGroup;
  selectedProduto: any = { id: '', descricao: '', valor: '', quantidade: '' };
  selectedProdutoVoid: any = { id: '', descricao: '', valor: '', quantidade: '' };

  constructor(private apiService: ApiService, private formBuilder: FormBuilder) {
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
      this.produtos = data;
    });
  }

  createOrUpdateProduto(): void {
    console.log(this.produtoForm);
    if (this.selectedProduto && this.selectedProduto.id) {
      this.apiService.updateProduto(this.produtoForm.value.id, this.produtoForm.value).subscribe(() => {
        this.getProdutos();
      });
    } else {
      this.apiService.createProduto(this.produtoForm.value).subscribe(() => {
        this.getProdutos();
      });
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
    this.apiService.deleteProduto(id).subscribe(() => {
      this.getProdutos();
    });
    this.clearForm();
  }

  clearForm(): void {
    this.produtoForm.reset();
  }

}
