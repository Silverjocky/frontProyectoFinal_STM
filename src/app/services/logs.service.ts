// suppliers.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Supplier {
  supplierId: number;
  contact: string;
  name: string;
  phone: string;
}

interface ApiResponse {
  estado: number;
  msg: string;
  suppliers: Supplier | Supplier[];
  links: Array<{
    rel: string;
    href: string;
  }>;
}


export class LogsService {

  // class implementation

}


@Injectable({
  providedIn: 'root'
})
export class SuppliersService {
  private apiUrl = 'https://stm-proyectofinal-suppliers.onrender.com/api/v1/suppliers';  // Ajusta esta URL según tu entorno

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getSuppliers(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl, { 
      headers: this.authService.getAuthHeaders() 
    });
  }

  getSupplier(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/${id}`, { 
      headers: this.authService.getAuthHeaders() 
    });
  }

  createSupplier(supplier: Partial<Supplier>): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiUrl, supplier, { 
      headers: this.authService.getAuthHeaders() 
    });
  }

  updateSupplier(id: number, supplier: Partial<Supplier>): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/${id}`, supplier, { 
      headers: this.authService.getAuthHeaders() 
    });
  }

  deleteSupplier(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`, { 
      headers: this.authService.getAuthHeaders() 
    });
  }
}