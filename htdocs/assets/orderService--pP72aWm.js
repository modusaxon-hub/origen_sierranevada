import{s as o}from"./index-CrxIS3Uf.js";const m={getUserOrders:async e=>{const{data:a,error:r}=await o.from("orders").select(`
                *,
                order_items (
                    *,
                    products (
                        name,
                        image_url
                    )
                )
            `).eq("user_id",e).order("created_at",{ascending:!1});return{data:a,error:r}},getOrderDetails:async e=>{const{data:a,error:r}=await o.from("orders").select(`
                *,
                order_items (
                    *,
                    products (*)
                )
            `).eq("id",e).single();return{data:a,error:r}},getStatusConfig(e){const a={pending_payment:{label:"Esperando Pago",color:"text-orange-400",bgColor:"bg-orange-500/20",icon:"hourglass_empty"},pending:{label:"Por Confirmar",color:"text-yellow-400",bgColor:"bg-yellow-500/20",icon:"pending"},processing:{label:"En Preparación",color:"text-blue-400",bgColor:"bg-blue-500/20",icon:"inventory_2"},paid:{label:"Pagado",color:"text-green-400",bgColor:"bg-green-500/20",icon:"check_circle"},shipped:{label:"En Camino",color:"text-orange-400",bgColor:"bg-orange-500/20",icon:"local_shipping"},delivered:{label:"Entregado",color:"text-green-400",bgColor:"bg-green-500/20",icon:"task_alt"},cancelled:{label:"Cancelado",color:"text-red-400",bgColor:"bg-red-500/20",icon:"cancel"}};return a[e]||a.pending},uploadPaymentProof:async(e,a)=>{const r=a.name.split(".").pop(),c=`proof_${e}_${Date.now()}.${r}`,n=`${e}/${c}`,{data:g,error:l}=await o.storage.from("payments").upload(n,a);if(l)return{data:null,error:l};const{data:{publicUrl:s}}=o.storage.from("payments").getPublicUrl(n),{data:t}=await o.from("orders").select("metadata").eq("id",e).single(),i={...typeof(t==null?void 0:t.metadata)=="string"?JSON.parse(t.metadata):(t==null?void 0:t.metadata)||{},payment_proof_url:s,proof_uploaded_at:new Date().toISOString()},{error:d}=await o.from("orders").update({metadata:i,status:"pending"}).eq("id",e);return{url:s,error:d}}};export{m as o};
