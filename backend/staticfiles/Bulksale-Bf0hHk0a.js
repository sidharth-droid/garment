import{ah as T,aj as A,r as y,ak as B,j as e,am as M,an as W,aw as $,ax as E,a5 as K,S as k,ad as g,J as D,a0 as S,T as v,U as s,a6 as C,a7 as w,a8 as P,a9 as p,K as R}from"./index-CazraW2q.js";import{C as L}from"./Container-BSE63Jy1.js";import{P as G}from"./Print-CmDghgSd.js";const z=t=>{const{absolute:r,children:n,classes:h,flexItem:i,light:m,orientation:d,textAlign:c,variant:u}=t;return W({root:["root",r&&"absolute",u,m&&"light",d==="vertical"&&"vertical",i&&"flexItem",n&&"withChildren",n&&d==="vertical"&&"withChildrenVertical",c==="right"&&d!=="vertical"&&"textAlignRight",c==="left"&&d!=="vertical"&&"textAlignLeft"],wrapper:["wrapper",d==="vertical"&&"wrapperVertical"]},$,h)},F=T("div",{name:"MuiDivider",slot:"Root",overridesResolver:(t,r)=>{const{ownerState:n}=t;return[r.root,n.absolute&&r.absolute,r[n.variant],n.light&&r.light,n.orientation==="vertical"&&r.vertical,n.flexItem&&r.flexItem,n.children&&r.withChildren,n.children&&n.orientation==="vertical"&&r.withChildrenVertical,n.textAlign==="right"&&n.orientation!=="vertical"&&r.textAlignRight,n.textAlign==="left"&&n.orientation!=="vertical"&&r.textAlignLeft]}})(A(({theme:t})=>({margin:0,flexShrink:0,borderWidth:0,borderStyle:"solid",borderColor:(t.vars||t).palette.divider,borderBottomWidth:"thin",variants:[{props:{absolute:!0},style:{position:"absolute",bottom:0,left:0,width:"100%"}},{props:{light:!0},style:{borderColor:t.vars?`rgba(${t.vars.palette.dividerChannel} / 0.08)`:E(t.palette.divider,.08)}},{props:{variant:"inset"},style:{marginLeft:72}},{props:{variant:"middle",orientation:"horizontal"},style:{marginLeft:t.spacing(2),marginRight:t.spacing(2)}},{props:{variant:"middle",orientation:"vertical"},style:{marginTop:t.spacing(1),marginBottom:t.spacing(1)}},{props:{orientation:"vertical"},style:{height:"100%",borderBottomWidth:0,borderRightWidth:"thin"}},{props:{flexItem:!0},style:{alignSelf:"stretch",height:"auto"}},{props:({ownerState:r})=>!!r.children,style:{display:"flex",textAlign:"center",border:0,borderTopStyle:"solid",borderLeftStyle:"solid","&::before, &::after":{content:'""',alignSelf:"center"}}},{props:({ownerState:r})=>r.children&&r.orientation!=="vertical",style:{"&::before, &::after":{width:"100%",borderTop:`thin solid ${(t.vars||t).palette.divider}`,borderTopStyle:"inherit"}}},{props:({ownerState:r})=>r.orientation==="vertical"&&r.children,style:{flexDirection:"column","&::before, &::after":{height:"100%",borderLeft:`thin solid ${(t.vars||t).palette.divider}`,borderLeftStyle:"inherit"}}},{props:({ownerState:r})=>r.textAlign==="right"&&r.orientation!=="vertical",style:{"&::before":{width:"90%"},"&::after":{width:"10%"}}},{props:({ownerState:r})=>r.textAlign==="left"&&r.orientation!=="vertical",style:{"&::before":{width:"10%"},"&::after":{width:"90%"}}}]}))),U=T("span",{name:"MuiDivider",slot:"Wrapper",overridesResolver:(t,r)=>{const{ownerState:n}=t;return[r.wrapper,n.orientation==="vertical"&&r.wrapperVertical]}})(A(({theme:t})=>({display:"inline-block",paddingLeft:`calc(${t.spacing(1)} * 1.2)`,paddingRight:`calc(${t.spacing(1)} * 1.2)`,whiteSpace:"nowrap",variants:[{props:{orientation:"vertical"},style:{paddingTop:`calc(${t.spacing(1)} * 1.2)`,paddingBottom:`calc(${t.spacing(1)} * 1.2)`}}]}))),I=y.forwardRef(function(r,n){const h=B({props:r,name:"MuiDivider"}),{absolute:i=!1,children:m,className:d,orientation:c="horizontal",component:u=m||c==="vertical"?"div":"hr",flexItem:o=!1,light:a=!1,role:l=u!=="hr"?"separator":void 0,textAlign:x="center",variant:j="fullWidth",...N}=h,b={...h,absolute:i,component:u,flexItem:o,light:a,orientation:c,role:l,textAlign:x,variant:j},f=z(b);return e.jsx(F,{as:u,className:M(f.root,d),role:l,ref:n,ownerState:b,"aria-orientation":l==="separator"&&(u!=="hr"||c==="vertical")?c:void 0,...N,children:m?e.jsx(U,{className:f.wrapper,ownerState:b,children:m}):null})});I&&(I.muiSkipListHighlight=!0);const V=K(e.jsx("path",{d:"M2.01 21 23 12 2.01 3 2 10l15 2-15 2z"}),"Send");function Y(){const[t,r]=y.useState({billNumber:"",salesDateTime:new Date().toISOString().slice(0,16),partyName:"",partyMobileNumber:"",partyAddress:"",partyGSTNumber:"",barcodeNumber:"",itemName:"",unit:"",unitPrice:"",tax:"",discount:"",totalPrice:"",paymentMethod1:"Cash",paymentMethod2:"UPI",narration:""}),[n,h]=y.useState(!1),i=a=>{const{name:l,value:x}=a.target;r({...t,[l]:x},m)};y.useEffect(()=>{m()},[t.unitPrice,t.tax,t.discount,n]);const m=()=>{const a=parseFloat(t.unitPrice)||0,l=parseFloat(t.tax)||0,x=parseFloat(t.discount)||0,j=n?a*l/100:0,N=a*x/100,b=a+j-N;r(f=>({...f,totalPrice:b.toFixed(2)}))},d=a=>{a.preventDefault(),console.log(t)},c=()=>{alert("Notification sent!")},u=()=>{const a=window.open("","","height=600,width=800"),l=`
      <html>
      <head>
        <title>Retail Sale Invoice</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: blue;
            background-color: #f9f9f9;
          }
          .invoice-container {
            width: 100%;
            max-width: 600px;
            margin: auto;
            border: 1px solid #ccc;
            padding: 20px;
            background-color: #fff;
          }
          .header {
            text-align: center;
            padding: 10px;
            background-color: #4caf50;
            color: red;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .section {
            margin-bottom: 20px;
          }
          .section h2 {
            margin-bottom: 10px;
            font-size: 18px;
            color: #4caf50;
          }
          .section p {
            margin: 5px 0;
            font-size: 14px;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
          }
          .table th, .table td {
            border: 1px solid #ddd;
            padding: 8px;
            font-size: 14px;
          }
          .table th {
            background-color: #f2f2f2;
            text-align: left;
          }
          .footer {
            text-align: center;
            padding: 10px;
            background-color: #4caf50;
            color: red;
            font-size: 14px;
          }
          .footer p {
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <h1>Retail Sale Receipt</h1>
            <p>Sales Date & Time: ${t.salesDateTime}</p>
          </div>
  
          <!-- Customer Information -->
          <div class="section">
            <h2>Customer Information</h2>
            <p><strong>Party Name:</strong> ${t.partyName}</p>
            <p><strong>Mobile Number:</strong> ${t.partyMobileNumber}</p>
            <p><strong>Address:</strong> ${t.partyAddress}</p>
            <p><strong>GST Number:</strong> ${t.partyGSTNumber}</p>
          </div>
  
          <!-- Item Information -->
          <div class="section">
            <h2>Item Information</h2>
            <table class="table">
              <tr>
                <th>Barcode</th>
                <td>${t.barcodeNumber}</td>
              </tr>
              <tr>
                <th>Item Name</th>
                <td>${t.itemName}</td>
              </tr>
              <tr>
                <th>Unit</th>
                <td>${t.unit}</td>
              </tr>
              <tr>
                <th>Unit Price</th>
                <td>${t.unitPrice}</td>
              </tr>
            </table>
          </div>
  
          <!-- Pricing and Tax -->
          <div class="section">
            <h2>Pricing and Tax</h2>
            <table class="table">
              <tr>
                <th>Tax (%)</th>
                <td>${t.tax}</td>
              </tr>
              ${n?`
                <tr>
                  <th>Discount (%)</th>
                  <td>${t.discount}</td>
                </tr>`:""}
              <tr>
                <th>Total Price</th>
                <td>${t.totalPrice}</td>
              </tr>
            </table>
          </div>
  
          <!-- Payment and Narration -->
          <div class="section">
            <h2>Payment and Narration</h2>
            <p><strong>Payment Method1:</strong> ${t.paymentMethod1}</p>
            <p><strong>Payment Method2:</strong> ${t.paymentMethod2}</p>
            <p><strong>Narration:</strong> ${t.narration}</p>
          </div>
  
          <!-- Footer -->
          <div class="footer">
            <p>Thank you for your purchase! Visit again!</p>
          </div>
        </div>
      </body>
      </html>
    `;a.document.open(),a.document.write(l),a.document.close(),a.print()},o=(a,l)=>{a.key==="Enter"&&(a.preventDefault(),l&&l.focus())};return e.jsx(L,{maxWidth:"lg",sx:{backgroundColor:"#f9dff5",position:"relative"},children:e.jsxs(k,{sx:{p:3,backgroundColor:"#f9dff5"},elevation:0,children:[e.jsx(g,{variant:"h5",gutterBottom:!0,align:"center",color:"secondary",children:"Bulk Sale"}),e.jsxs(g,{variant:"body2",color:"textSecondary",align:"center",children:["Sales Date & Time: ",t.salesDateTime]}),e.jsxs(D,{sx:{position:"absolute",top:16,right:16,display:"flex",gap:1},children:[e.jsx(S,{onClick:c,sx:{color:"#370140"},children:e.jsx(V,{})}),e.jsx(S,{onClick:u,sx:{color:"#370140"},children:e.jsx(G,{})})]}),e.jsxs(D,{component:"form",onSubmit:d,sx:{mt:2},children:[e.jsxs(v,{container:!0,spacing:2,children:[e.jsxs(v,{item:!0,xs:12,md:3,children:[e.jsx(g,{variant:"subtitle1",sx:{marginTop:"-30px"},color:"textPrimary",children:"Party Information"}),e.jsx(s,{fullWidth:!0,label:"Bill Number",name:"billNumber",value:t.billNumber,onChange:i,margin:"normal",variant:"outlined",onKeyDown:a=>o(a,document.getElementById("partyName")),sx:{marginBottom:"39px"}}),e.jsx(s,{id:"partyName",fullWidth:!0,label:"Party Name",name:"partyName",value:t.partyName,onChange:i,margin:"normal",variant:"outlined",onKeyDown:a=>o(a,document.getElementById("partyMobileNumber"))}),e.jsx(s,{id:"partyMobileNumber",fullWidth:!0,label:"Mobile Number",name:"partyMobileNumber",value:t.partyMobileNumber,onChange:i,margin:"normal",type:"tel",variant:"outlined",onKeyDown:a=>o(a,document.getElementById("partyAddress"))}),e.jsx(s,{id:"partyAddress",fullWidth:!0,multiline:!0,rows:1,label:"Address",name:"partyAddress",value:t.partyAddress,onChange:i,margin:"normal",variant:"outlined",onKeyDown:a=>o(a,document.getElementById("partyGSTNumber"))})]}),e.jsxs(v,{item:!0,xs:12,md:3,children:[e.jsx(s,{id:"partyGSTNumber",fullWidth:!0,label:"GST Number",name:"partyGSTNumber",value:t.partyGSTNumber,onChange:i,margin:"normal",variant:"outlined",onKeyDown:a=>o(a,document.getElementById("barcodeNumber"))}),e.jsx(g,{variant:"subtitle1",color:"textPrimary",children:"Item Information"}),e.jsx(s,{id:"barcodeNumber",fullWidth:!0,label:"Barcode Number",name:"barcodeNumber",value:t.barcodeNumber,onChange:i,margin:"normal",variant:"outlined",onKeyDown:a=>o(a,document.getElementById("itemName"))}),e.jsx(s,{id:"itemName",fullWidth:!0,label:"Item Name",name:"itemName",value:t.itemName,onChange:i,margin:"normal",variant:"outlined",onKeyDown:a=>o(a,document.getElementById("unit"))}),e.jsx(s,{id:"unit",fullWidth:!0,label:"Unit",name:"unit",value:t.unit,onChange:i,margin:"normal",variant:"outlined",onKeyDown:a=>o(a,document.getElementById("unitPrice"))})]}),e.jsxs(v,{item:!0,xs:12,md:3,children:[e.jsx(s,{id:"unitPrice",fullWidth:!0,label:"Unit Price",name:"unitPrice",value:t.unitPrice,onChange:i,margin:"normal",type:"number",variant:"outlined",onKeyDown:a=>o(a,document.getElementById("tax"))}),e.jsx(g,{variant:"subtitle1",gutterBottom:!0,color:"textPrimary",children:"Pricing and Tax"}),e.jsx(s,{id:"tax",fullWidth:!0,label:"Tax (%)",name:"tax",value:t.tax,onChange:i,margin:"normal",type:"number",variant:"outlined",onKeyDown:a=>o(a,document.getElementById("isDiscountApplicable"))}),e.jsxs(C,{fullWidth:!0,margin:"normal",variant:"outlined",children:[e.jsx(w,{children:"Apply Discount"}),e.jsxs(P,{id:"isDiscountApplicable",name:"isDiscountApplicable",value:n?"true":"false",onChange:a=>h(a.target.value==="true"),label:"Apply Discount",onKeyDown:a=>o(a,document.getElementById("discount")),children:[e.jsx(p,{value:"false",children:"No"}),e.jsx(p,{value:"true",children:"Yes"})]})]}),n&&e.jsx(s,{id:"discount",fullWidth:!0,label:"Discount (%)",name:"discount",value:t.discount,onChange:i,margin:"normal",type:"number",variant:"outlined",onKeyDown:a=>o(a,document.getElementById("totalPrice"))}),e.jsx(I,{sx:{my:1}})]}),e.jsxs(v,{item:!0,xs:10,md:3,children:[e.jsxs(C,{fullWidth:!0,margin:"normal",variant:"outlined",children:[e.jsx(w,{children:"Payment Method1"}),e.jsxs(P,{name:"paymentMethod",value:t.paymentMethod,onChange:i,label:"Payment Method1",onKeyDown:a=>o(a,document.getElementById("narration")),sx:{marginBottom:"33px"},children:[e.jsx(p,{value:"Cash",children:"Cash"}),e.jsx(p,{value:"Credit",children:"Credit"}),e.jsx(p,{value:"Debit",children:"Debit"})]})]}),e.jsxs(C,{fullWidth:!0,margin:"normal",variant:"outlined",children:[e.jsx(w,{children:"Payment Method2"}),e.jsxs(P,{name:"paymentMethod",value:t.paymentMethod,onChange:i,label:"Payment Method2",onKeyDown:a=>o(a,document.getElementById("narration")),children:[e.jsx(p,{value:"Cash",children:"Cash"}),e.jsx(p,{value:"Credit",children:"Credit"}),e.jsx(p,{value:"Debit",children:"Debit"})]})]}),e.jsx(s,{id:"narration",fullWidth:!0,label:"Narration",name:"narration",value:t.narration,onChange:i,margin:"normal",multiline:!0,rows:3,variant:"outlined",onKeyDown:a=>o(a,null)})]})]}),e.jsxs(g,{variant:"h6",align:"center",children:["Total Price: ₹",t.totalPrice]}),e.jsx(D,{sx:{display:"flex",justifyContent:"center",mt:3},children:e.jsx(R,{type:"submit",variant:"contained",color:"secondary",fullWidth:!0,sx:{mt:2,marginTop:"-5px"},children:"Submit"})})]})]})})}export{Y as default};
