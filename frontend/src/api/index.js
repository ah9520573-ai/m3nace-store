import client from './client';
export const productsApi={list:params=>client.get('/products',{params}),one:id=>client.get(`/products/${id}`),create:data=>client.post('/products',data),update:(id,data)=>client.put(`/products/${id}`,data),remove:id=>client.delete(`/products/${id}`)};
export const ordersApi={create:data=>client.post('/orders',data),mine:()=>client.get('/orders/my'),all:()=>client.get('/orders'),status:(id,status)=>client.put(`/orders/${id}/status`,{status})};
export const adminApi={stats:()=>client.get('/admin/stats'),users:()=>client.get('/users'),download:type=>client.get(`/admin/export/${type}`,{responseType:'blob'}).then(response=>{const url=URL.createObjectURL(response.data);const link=document.createElement('a');link.href=url;link.download=`${type}.xlsx`;link.click();URL.revokeObjectURL(url);})};
export default client;
