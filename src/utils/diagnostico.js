// Script de diagnóstico para verificar la conectividad con el backend
// Ejecutar en la consola del navegador o como test

const diagnostico = {
  async verificarBackend() {
    console.log('🔍 Verificando conectividad con el backend...');
    
    try {
      const response = await fetch('http://localhost:4000/health');
      const data = await response.json();
      console.log('✅ Backend está funcionando:', data);
      return true;
    } catch (error) {
      console.error('❌ Backend no responde:', error.message);
      return false;
    }
  },

  async verificarCORS() {
    console.log('🔍 Verificando configuración de CORS...');
    
    try {
      const response = await fetch('http://localhost:4000/api/test-cors');
      const data = await response.json();
      console.log('✅ CORS está funcionando:', data);
      return true;
    } catch (error) {
      console.error('❌ Problema con CORS:', error.message);
      return false;
    }
  },

  async verificarLogin() {
    console.log('🔍 Verificando endpoint de login...');
    
    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@biblioteca.com',
          password: '123'
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Login exitoso:', { 
          hasToken: !!data.token, 
          hasUser: !!data.user,
          userRole: data.user?.rol 
        });
        return true;
      } else {
        const error = await response.json();
        console.error('❌ Login falló:', response.status, error);
        return false;
      }
    } catch (error) {
      console.error('❌ Error en login:', error.message);
      return false;
    }
  },

  async ejecutarTodos() {
    console.log('🚀 Iniciando diagnóstico completo...\n');
    
    const resultados = {
      backend: await this.verificarBackend(),
      cors: await this.verificarCORS(),
      login: await this.verificarLogin()
    };

    console.log('\n📊 Resumen del diagnóstico:');
    console.table(resultados);

    const todosFuncionan = Object.values(resultados).every(r => r);
    
    if (todosFuncionan) {
      console.log('🎉 ¡Todo está funcionando correctamente!');
    } else {
      console.log('⚠️ Hay problemas que necesitan atención.');
    }

    return resultados;
  }
};

// Para usar en la consola del navegador:
// diagnostico.ejecutarTodos()

// Para usar en Node.js (descomentar las siguientes líneas):
/*
if (typeof window === 'undefined') {
  global.fetch = require('node-fetch');
  diagnostico.ejecutarTodos();
}
*/

export default diagnostico;