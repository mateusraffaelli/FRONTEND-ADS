
document.addEventListener('DOMContentLoaded', function () {

    const form   = document.getElementById('form-cadastro');
    const alerta = document.getElementById('alerta-cadastro');
    const campoCpf = document.getElementById('cad-cpf');

    function mostrarAlerta(html) {
        alerta.innerHTML = html;
        alerta.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (campoCpf) {
        campoCpf.addEventListener('input', function () {
            let v = this.value.replace(/\D/g, '');
            if (v.length > 11) v = v.substring(0, 11);
            if (v.length > 9) {
                v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
            } else if (v.length > 6) {
                v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
            } else if (v.length > 3) {
                v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
            }
            this.value = v;
        });
    }

    const campoCep = document.getElementById('cad-cep');
    if (campoCep) {
        campoCep.addEventListener('input', function () {
            let v = this.value.replace(/\D/g, '');
            if (v.length > 8) v = v.substring(0, 8);
            if (v.length > 5) {
                v = v.replace(/(\d{5})(\d{1,3})/, '$1-$2');
            }
            this.value = v;
        });
    }

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const nome   = document.getElementById('cad-nome').value.trim();
            const email  = document.getElementById('cad-email').value.trim();
            const cpf    = document.getElementById('cad-cpf').value.trim();
            const tel    = document.getElementById('cad-tel').value.trim();
            const cep    = document.getElementById('cad-cep').value.trim();
            const rua    = document.getElementById('cad-rua').value.trim();
            const numero = document.getElementById('cad-numero').value.trim();
            const complemento = document.getElementById('cad-complemento').value.trim();
            const senha  = document.getElementById('cad-senha').value;
            const senha2 = document.getElementById('cad-senha2').value;


            if (!nome || !email || !cpf || !cep || !rua || !numero || !senha) {
                mostrarAlerta('<div class="alerta alerta-erro">Preencha todos os campos obrigatorios!</div>');
                return;
            }
            const cepLimpo = cep.replace(/\D/g, '');
            if (cepLimpo.length !== 8) {
                mostrarAlerta('<div class="alerta alerta-erro">CEP invalido! Use um CEP com 8 digitos.</div>');
                return;
            }

            
            if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
                mostrarAlerta('<div class="alerta alerta-erro">E-mail invalido!</div>');
                return;
            }

            
            if (!validarCPF(cpf)) {
                mostrarAlerta('<div class="alerta alerta-erro">CPF invalido! Use um CPF valido com 11 digitos.</div>');
                return;
            }

            
            if (senha.length < 6) {
                mostrarAlerta('<div class="alerta alerta-erro">A senha deve ter no minimo 6 caracteres!</div>');
                return;
            }

            if (senha !== senha2) {
                mostrarAlerta('<div class="alerta alerta-erro">As senhas nao conferem!</div>');
                return;
            }

            
            const resultado = cadastrarCliente({
                nome: nome,
                email: email,
                cpf: cpf.replace(/\D/g, ''),
                telefone: tel,
                rua: rua,
                cep: cepLimpo,
                numero: numero,
                complemento: complemento,
                senha: senha
            });

            if (!resultado.ok) {
                mostrarAlerta('<div class="alerta alerta-erro">' + resultado.msg + '</div>');
                return;
            }

            mostrarAlerta('<div class="alerta alerta-sucesso">Cadastro realizado com sucesso! Seu ID: <strong>' + resultado.id + '</strong>. Redirecionando para o login...</div>');
            form.reset();

            setTimeout(function () {
                window.location.href = 'login.html';
            }, 2500);
        });
    }

});
