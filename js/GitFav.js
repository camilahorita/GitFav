import { UserGithub } from "./UserGithub.js";

export class GitFav {
  constructor(root){
    this.root = document.querySelector(root);
    this.load();
    
  }
   async add (username) {
     
     try {

      const userExists = this.entries.find(entry => entry.login === username);
      if (userExists){
        throw new Error('Usuário já existe');
      }

      const user= await UserGithub.search(username)
      if (user.login === undefined){
        throw new Error('Usuário não encontrado');
      }
      this.entries = [user, ...this.entries];
      this.update();
      this.save();

     } catch (error) {
       alert(error.message)
     }
  
  }

  save () {
    localStorage.setItem('@gitfav:', JSON.stringify(this.entries));
  }
  load() {
    
    this.entries= JSON.parse(localStorage.getItem('@gitfav:'))  || []
  }
  delete(user) {
    const filterEntries = this.entries
    .filter(entry => entry.login !== user.login);

    this.entries = filterEntries;
    this.update();
    this.save();

  }
}

export class FavView extends GitFav {
  constructor(root){
    super(root)
    this.tbody = this.root.querySelector('table tbody');
    this.update();
    this.onadd()
  }
  onadd (){
    const buttonAdd = this.root.querySelector('#addbutton');
    buttonAdd.onclick = () => {
      const input = this.root.querySelector('#inputgithubuser');
      const {value} = input;
      this.add(value);
      input.value = '';
    }
    
  }

  update(){
    this.removeAllTr();

    this.entries.forEach( user => {
      const row = this.createRow();
      row.querySelector('td img').src = `https://github.com/${user.login}.png`;
      row.querySelector('td img').alt = `Imagem do usuário ${user.name}`;
      row.querySelector('.user a').href = `https://github.com/${user.login}`;
      row.querySelector('.user a').textContent = user.name;
      row.querySelector('.user p').textContent = user.login;
      row.querySelector('.repo').textContent = user.public_repos;
      row.querySelector('.followers').textContent = user.followers;

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar essa linha?');
        if (isOk) {
          this.delete(user);
        }

      }

      this.tbody.append(row);

    })

  }
  createRow(){

    const tr = document.createElement('tr');

    const inner = `
    <td class="userinfo">
      <img src="https://github.com/camilahorita.png" alt="Imagem do usuário Camila">
      <div class="user">
        <a href="https://github.com/camilahorita">Camila Horita</a>
        <p>/camilahorita</p>
      </div>
    </td>
    <td class='repo'>123</td>
    <td class='followers'>1234</td>
    <td><button class="remove">Remover</button></td>`;

    tr.innerHTML = inner;

    return tr;

  }

  removeAllTr (){
    

    this.tbody.querySelectorAll('tr').forEach(tr => {
      tr.remove();
    });
  }
}