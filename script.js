const $=id=>document.getElementById(id);
const get=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};
const set=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const pagina=document.body.dataset.page;

function toggle(id){['menu','acc'].forEach(d=>{const e=$(d);e.classList.toggle('on',d===id&&!e.classList.contains('on'))})}
function sair(){localStorage.removeItem('logado');location.href='index.html'}

if(document.body.dataset.privada&&!get('logado',false))location.href='index.html';

function registrar(){
  const v=['rn','rc','rt','rs','rr'].map(i=>$(i).value.trim()),e=$('re');
  if(v.some(x=>!x))return e.textContent='Preencha todos os campos.';
  if(v[1].replace(/\D/g,'').length!=11)return e.textContent='CPF inválido.';
  if(v[3].length<6)return e.textContent='Senha com no mínimo 6 caracteres.';
  if(v[3]!=v[4])return e.textContent='As senhas não coincidem.';
  set('user',{nome:v[0],cpf:v[1],tel:v[2],email:'',senha:v[3]});
  set('codigo',String(Math.floor(1e5+Math.random()*9e5)));
  location.href='verificacao.html';
}
function verificar(){
  if($('vc').value===get('codigo','x')){set('logado',true);location.href='home.html'}
  else $('ve').textContent='Código incorreto.';
}
function entrar(){
  const em=$('le').value;if(!em.includes('@'))return $('lerr').textContent='Informe um email válido.';
  const u=get('user',{nome:'Aluno',cpf:'',tel:'',senha:''});u.email=em;set('user',u);set('logado',true);location.href='home.html';
}

function treinos(){
  const feitos=get('feitos',{});const n=Object.values(feitos).filter(Boolean).length,s=10+n;
  $('pct').textContent=Math.round(s/20*100)+'%';$('ses').textContent='Sessões: '+s+'/20';$('barra').style.width=s*5+'%';
  document.querySelectorAll('.ex input').forEach((c,i)=>{c.checked=!!feitos[i];c.onchange=()=>{feitos[i]=c.checked;set('feitos',feitos);treinos()}});
}

const UN={Pernambuco:{Recife:['unidade Graças','unidade Ipsep','unidade Piedade'],Olinda:['unidade Carmo']},Ceará:{Fortaleza:['unidade Aldeota','unidade Meireles']}};
function filtros(){
  $('se').innerHTML=Object.keys(UN).map(e=>`<option>${e}</option>`).join('');
  $('se').onchange=cidades;$('sc').onchange=lista;cidades();
}
function cidades(){$('sc').innerHTML=Object.keys(UN[$('se').value]).map(c=>`<option>${c}</option>`).join('');lista()}
function lista(){
  const l=$('ul');if(!l)return;
  l.innerHTML=UN[$('se').value][$('sc').value].map(u=>`<div class="item" style="display:flex;gap:10px;align-items:center;min-height:90px"><div class="th" style="width:60px;height:60px"></div><div style="flex:1">${u}</div><span class="tag">Local</span></div>`).join('');
}

function carregarConta(){const u=get('user',{});$('ge').value=u.email||'';$('gn').value=u.nome||'';$('gc').value=u.cpf||'';$('gt').value=u.tel||''}
function salvar(){
  const u=get('user',{});u.email=$('ge').value;u.nome=$('gn').value;u.cpf=$('gc').value;u.tel=$('gt').value;
  if($('gs').value)u.senha=$('gs').value;set('user',u);$('gm').textContent='Dados atualizados!';
}
function perfil(){
  const f=get('foto',null);
  if(f)$('av').innerHTML=`<img src="${f}" alt="Foto de perfil">`;
  $('nome').textContent=get('user',{}).nome||'';
}
function upload(i){const f=i.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{set('foto',r.result);perfil()};r.readAsDataURL(f)}
function excluirFoto(){localStorage.removeItem('foto');location.reload()}

if(pagina==='treinos')treinos();
if(pagina==='horarios'||pagina==='unidades')filtros();
if(pagina==='gerenciar')carregarConta();
if(pagina==='perfil')perfil();
