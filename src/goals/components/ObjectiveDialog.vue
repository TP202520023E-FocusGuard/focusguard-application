<template>
  <v-dialog
    :model-value="dialog"
    @update:model-value="$emit('update:dialog', $event)"
    max-width="500"
    persistent
  >
    <v-card class="compact-dialog">
      <!-- Header compacto -->
      <v-card-title class="compact-dialog-header">
        <div class="compact-header-content">
          <v-icon color="primary" size="24" class="compact-header-icon">mdi-target</v-icon>
          <div class="compact-header-text">
            <div class="compact-dialog-title">{{ dialogTitle }}</div>
            <div class="compact-dialog-subtitle">{{ dialogSubtitle }}</div>
          </div>
        </div>
        <v-btn 
          icon 
          @click="close" 
          size="small" 
          variant="text"
          class="compact-close-btn"
        >
          <v-icon size="18">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- Contenido del formulario compacto -->
      <v-card-text class="compact-dialog-content">
        <div class="compact-form-container">
          <!-- Tipo de Objetivo compacto -->
          <div class="compact-form-section">
            <label class="compact-section-label">Tipo de objetivo</label>
            <v-btn-toggle
              v-model="formData.tipo"
              mandatory
              class="compact-toggle-group"
              color="primary"
              rounded
            >
              <v-btn value="menos" size="small" class="compact-toggle-btn">
                <v-icon start size="16">mdi-trending-down</v-icon>
                Menos
              </v-btn>
              <v-btn value="mas" size="small" class="compact-toggle-btn">
                <v-icon start size="16">mdi-trending-up</v-icon>
                Más
              </v-btn>
            </v-btn-toggle>
          </div>

          <!-- Tiempo por día compacto CON VALIDACIONES MEJORADAS -->
          <div class="compact-form-section">
            <label class="compact-section-label">Tiempo por día</label>
            <div class="compact-time-section">
              <div class="compact-time-inputs">
                <v-text-field
                  ref="horasInput"
                  v-model="formData.horas"
                  type="text"
                  variant="outlined"
                  placeholder="0"
                  class="compact-time-input"
                  density="compact"
                  :error="!!errores.horas"
                  :error-messages="errores.horas"
                  @input="limitarHoras"
                  @keypress="soloNumeros"
                  @blur="validarYFormatearHoras"
                >
                  <template #label>
                    <span class="compact-input-label">Horas</span>
                  </template>
                </v-text-field>
                
                <div class="compact-time-separator">y</div>
                
                <v-text-field
                  ref="minutosInput"
                  v-model="formData.minutos"
                  type="text"
                  variant="outlined"
                  placeholder="0"
                  class="compact-time-input"
                  density="compact"
                  :error="!!errores.minutos"
                  :error-messages="errores.minutos"
                  @input="limitarMinutos"
                  @keypress="soloNumeros"
                  @blur="validarYFormatearMinutos"
                >
                  <template #label>
                    <span class="compact-input-label">Minutos</span>
                  </template>
                </v-text-field>
              </div>
              <div class="compact-time-context">por día en</div>
              
              <!-- Mensaje de validación -->
              <div v-if="!tiempoEsValido && (formData.horas || formData.minutos)" class="error-message">
                ⚠️ Debes ingresar al menos algún tiempo (horas o minutos)
              </div>
            </div>
          </div>

          <!-- Categorías compactas -->
          <div class="compact-form-section">
            <v-select
              v-model="formData.categoriaPrincipal"
              :items="categoriasPrincipal"
              item-title="title"
              item-value="value"
              label="Categoría principal"
              variant="outlined"
              hide-details
              density="compact"
              class="compact-select"
              return-object
              :menu-props="{ contentClass: 'compact-dialog-dropdown', attach: 'body' }"
            ></v-select>
          </div>

          <div class="compact-form-section" v-if="formData.categoriaPrincipal">
            <v-select
              v-model="formData.subcategoria"
              :items="subcategoriasFiltradas"
              item-title="title"
              item-value="value"
              :label="formData.categoriaPrincipal.title"
              variant="outlined"
              hide-details
              density="compact"
              class="compact-select"
              return-object
              :menu-props="{ contentClass: 'compact-dialog-dropdown', attach: 'body' }"
            ></v-select>
          </div>

          <!-- Mensaje de advertencia semántica -->
          <div v-if="advertenciaSemantica" class="semantic-warning">
            <v-icon size="14" class="mr-1">mdi-alert-circle</v-icon>
            {{ advertenciaSemantica }}
          </div>

          <!-- Mensaje de validación de tiempo mínimo -->
          <div v-if="tiempoEsValido && tiempoMinimoPermitido > 0 && tiempoTotalEnMinutos < tiempoMinimoPermitido" class="error-message">
            ⚠️ Para objetivos de reducción en categorías Productivas, debes establecer un tiempo mínimo (al menos 1 minuto)
          </div>

          <!-- Vista previa compacta -->
          <div class="compact-form-section" v-if="formularioValido">
            <label class="compact-section-label">Vista previa</label>
            <v-card variant="outlined" class="compact-preview-card" :color="formData.tipo === 'mas' ? 'success' : 'warning'">
              <v-card-text class="compact-preview-content">
                <div class="compact-preview-text">
                  <v-icon :color="formData.tipo === 'mas' ? 'success' : 'warning'" size="16" class="mr-2">
                    {{ formData.tipo === 'mas' ? 'mdi-trending-up' : 'mdi-trending-down' }}
                  </v-icon>
                  {{ generarTextoObjetivoCompacto() }}
                </div>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </v-card-text>

      <!-- Acciones compactas -->
      <v-card-actions class="compact-dialog-actions">
        <v-btn 
          variant="outlined" 
          @click="close"
          size="small"
          class="compact-cancel-btn"
        >
          Cancelar
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn 
          color="primary" 
          @click="guardar"
          :disabled="!formularioValido"
          size="small"
          class="compact-create-btn"
        >
          <v-icon start size="16">mdi-check</v-icon>
          {{ buttonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "NewObjectiveDialog",
  props: {
    dialog: {
      type: Boolean,
      required: true,
      default: false
    },
    objectiveToEdit: {
      type: Object,
      default: null
    }
  },
  emits: ['update:dialog', 'guardar'],
  data() {
    return {
      formData: {
        tipo: 'menos',
        horas: '',
        minutos: '',
        categoriaPrincipal: null,
        subcategoria: null
      },
      errores: {
        horas: '',
        minutos: ''
      },
      categoriasPrincipal: [
        { 
          title: 'Categorización de sitio', 
          value: 'categorizacion_sitio',
          icon: 'mdi-web',
          color: 'blue'
        },
        { 
          title: 'Clasificación de contenido', 
          value: 'clasificacion_contenido',
          icon: 'mdi-file-document',
          color: 'green'
        }
      ],
      subcategorias: {
        'categorizacion_sitio': [
          { title: 'Productivo', value: 'productivo', icon: 'mdi-check-circle', color: 'success', tipo: 'productiva' },
          { title: 'Neutral', value: 'neutral', icon: 'mdi-minus-circle', color: 'grey', tipo: 'neutral' },
          { title: 'Doble Filo', value: 'doble_filo', icon: 'mdi-alert-circle', color: 'warning', tipo: 'doble-filo' },
          { title: 'Distractivo', value: 'distractivo', icon: 'mdi-close-circle', color: 'error', tipo: 'distractivo' }
        ],
        'clasificacion_contenido': [
          { title: 'Ocio', value: 'ocio', icon: 'mdi-gamepad-variant', color: 'orange', tipo: 'ocio' },
          { title: 'No Ocio', value: 'no_ocio', icon: 'mdi-briefcase', color: 'indigo', tipo: 'no_ocio' }
        ]
      }
    };
  },
  computed: {
    // Computadas para el modo edición
    isEditing() {
      return !!this.objectiveToEdit;
    },
    dialogTitle() {
      return this.isEditing ? 'Editar Objetivo' : 'Nuevo Objetivo';
    },
    dialogSubtitle() {
      return this.isEditing ? 'Modifica tu objetivo' : 'Configura tu objetivo';
    },
    buttonText() {
      return this.isEditing ? 'Guardar Cambios' : 'Crear';
    },
    
    subcategoriasFiltradas() {
      if (!this.formData.categoriaPrincipal) return [];
      const categoriaKey = this.formData.categoriaPrincipal.value;
      return this.subcategorias[categoriaKey] || [];
    },
    
    tiempoTotalEnMinutos() {
      const horas = parseInt(this.formData.horas) || 0;
      const minutos = parseInt(this.formData.minutos) || 0;
      return horas * 60 + minutos;
    },
    
    tiempoEsValido() {
      const horas = parseInt(this.formData.horas) || 0;
      const minutos = parseInt(this.formData.minutos) || 0;
      return horas > 0 || minutos > 0;
    },
    
    // Determina si la categoría seleccionada es productiva
    esCategoriaProductiva() {
      if (!this.formData.subcategoria) return false;
      const subcategoriaData = this.subcategoriasFiltradas.find(
        s => s.value === this.formData.subcategoria.value
      );
      return subcategoriaData?.tipo === 'productiva';
    },
    
    // Determina si es objetivo de reducción (menos)
    esObjetivoReduccion() {
      return this.formData.tipo === 'menos';
    },
    
    // Validación semántica: no tiene sentido reducir tiempo productivo
    tieneSentidoSemantico() {
      // Si no hay subcategoría seleccionada, aún no podemos validar
      if (!this.formData.subcategoria) return true;
      
      // Caso 1: Categoría productiva + Reducir = NO tiene sentido
      if (this.esCategoriaProductiva && this.esObjetivoReduccion) {
        return false;
      }
      
      // Caso 2: Categoría NO productiva (ocio, distractivo, neutral) + Aumentar = SÍ tiene sentido
      // Caso 3: Categoría NO productiva + Reducir = SÍ tiene sentido
      return true;
    },
    
    // Mensaje de advertencia semántica
    advertenciaSemantica() {
      if (!this.formData.subcategoria) return '';
      
      if (this.esCategoriaProductiva && this.esObjetivoReduccion) {
        return '⚠️ No tiene sentido reducir tiempo en sitios Productivos. Deberías aumentarlo o mantenerlo.';
      }
      
      if (!this.esCategoriaProductiva && !this.esObjetivoReduccion && this.formData.tipo === 'mas') {
        return 'ℹ️ Aumentar tiempo en categorías no productivas puede ser contraproducente. ¿Estás seguro?';
      }
      
      return '';
    },
    
    // Tiempo mínimo permitido según contexto
    tiempoMinimoPermitido() {
      // Para categoría productiva con objetivo "menos", el mínimo es 1 minuto
      if (this.esCategoriaProductiva && this.esObjetivoReduccion) {
        return 1;
      }
      return 0;
    },
    
    // Override de formulario válido con validación semántica
    formularioValido() {
      // Validaciones básicas
      if (!this.formData.tipo) return false;
      if (!this.tiempoEsValido) return false;
      if (this.errores.horas) return false;
      if (this.errores.minutos) return false;
      if (!this.formData.categoriaPrincipal) return false;
      if (!this.formData.subcategoria) return false;
      
      // Validación semántica
      if (!this.tieneSentidoSemantico) return false;
      
      // Validación de tiempo mínimo
      if (this.tiempoMinimoPermitido > 0 && this.tiempoTotalEnMinutos < this.tiempoMinimoPermitido) {
        return false;
      }
      
      return true;
    }
  },
  watch: {
    'formData.categoriaPrincipal'() {
      this.formData.subcategoria = null;
    },
    
    'formData.subcategoria'() {
      // Re-validar tiempos cuando cambia la categoría
      this.validarYFormatearHoras();
      this.validarYFormatearMinutos();
    },
    
    'formData.tipo'() {
      // Re-validar tiempos cuando cambia el tipo
      this.validarYFormatearHoras();
      this.validarYFormatearMinutos();
    },
    
    objectiveToEdit: {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal.datos) {
          this.formData = {
            tipo: newVal.datos.tipo || 'menos',
            horas: newVal.datos.horas?.toString() || '0',
            minutos: newVal.datos.minutos?.toString() || '0',
            categoriaPrincipal: newVal.datos.categoriaPrincipal || null,
            subcategoria: newVal.datos.subcategoria || null
          };
        } else {
          this.limpiarFormulario();
        }
      }
    },
    
    dialog(newVal) {
      if (!newVal) {
        this.limpiarFormulario();
      }
    }
  },
  methods: {
    // Impedir que se escriban caracteres no numéricos
    soloNumeros(event) {
      const charCode = event.which ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        event.preventDefault();
        return false;
      }
      return true;
    },

    // Limitar horas a máximo 2 dígitos y rango 0-24
    limitarHoras() {
      let valor = this.formData.horas;
      
      valor = valor.replace(/[^\d]/g, '');
      
      if (valor.length > 2) {
        valor = valor.substring(0, 2);
      }
      
      const numero = parseInt(valor) || 0;
      if (numero > 24) {
        valor = '24';
      }
      
      this.formData.horas = valor;
      this.validarHoras();
    },

    // Limitar minutos a máximo 2 dígitos y rango 0-59
    limitarMinutos() {
      let valor = this.formData.minutos;
      
      valor = valor.replace(/[^\d]/g, '');
      
      if (valor.length > 2) {
        valor = valor.substring(0, 2);
      }
      
      const numero = parseInt(valor) || 0;
      if (numero > 59) {
        valor = '59';
      }
      
      this.formData.minutos = valor;
      this.validarMinutos();
    },

    // Validación de horas
    validarHoras() {
      const valor = this.formData.horas;
      
      if (valor === '') {
        this.errores.horas = '';
        return;
      }
      
      const numero = parseInt(valor);
      if (isNaN(numero)) {
        this.errores.horas = 'Valor inválido';
        return;
      }
      
      if (numero < 0 || numero > 24) {
        this.errores.horas = 'Debe ser entre 0 y 24';
        return;
      }
      
      this.errores.horas = '';
    },

    // Validación de minutos
    validarMinutos() {
      const valor = this.formData.minutos;
      
      if (valor === '') {
        this.errores.minutos = '';
        return;
      }
      
      const numero = parseInt(valor);
      if (isNaN(numero)) {
        this.errores.minutos = 'Valor inválido';
        return;
      }
      
      if (numero < 0 || numero > 59) {
        this.errores.minutos = 'Debe ser entre 0 y 59';
        return;
      }
      
      this.errores.minutos = '';
    },

    // Formatear horas al perder foco
    validarYFormatearHoras() {
      let numero = parseInt(this.formData.horas) || 0;
      
      // Validación semántica para productivo + reducción
      if (this.esCategoriaProductiva && this.esObjetivoReduccion) {
        const minutos = parseInt(this.formData.minutos) || 0;
        if (numero === 0 && minutos === 0) {
          this.formData.minutos = '1';
          this.validarMinutos();
        }
      }
      
      if (numero > 24) {
        numero = 24;
      } else if (numero < 0) {
        numero = 0;
      }
      
      this.formData.horas = numero.toString();
      this.validarHoras();
    },

    // Formatear minutos al perder foco
    validarYFormatearMinutos() {
      let numero = parseInt(this.formData.minutos) || 0;
      
      // Validación semántica para productivo + reducción
      if (this.esCategoriaProductiva && this.esObjetivoReduccion) {
        const horas = parseInt(this.formData.horas) || 0;
        if (horas === 0 && numero === 0) {
          numero = 1;
        }
      }
      
      if (numero > 59) {
        numero = 59;
      } else if (numero < 0) {
        numero = 0;
      }
      
      this.formData.minutos = numero.toString();
      this.validarMinutos();
    },

    guardar() {
      this.validarYFormatearHoras();
      this.validarYFormatearMinutos();
      
      if (this.formularioValido) {
        const objetivoCompleto = {
          ...this.formData,
          horas: parseInt(this.formData.horas) || 0,
          minutos: parseInt(this.formData.minutos) || 0,
          texto: this.generarTextoObjetivo()
        };
        
        if (this.isEditing) {
          objetivoCompleto.id = this.objectiveToEdit.id;
        }
        
        this.$emit('guardar', objetivoCompleto);
        this.close();
      }
    },

    generarTextoObjetivo() {
      const { tipo, categoriaPrincipal, subcategoria } = this.formData;
      const horas = parseInt(this.formData.horas) || 0;
      const minutos = parseInt(this.formData.minutos) || 0;
      
      const tiempo = [];
      if (horas > 0) tiempo.push(`${horas}h`);
      if (minutos > 0) tiempo.push(`${minutos}min`);
      
      const textoTiempo = tiempo.length > 0 ? tiempo.join(' ') : '0min';
      const accion = tipo === 'mas' ? 'Aumentar' : 'Reducir';
      
      return `${accion} a ${textoTiempo} en ${subcategoria.title} (${categoriaPrincipal.title})`;
    },

    generarTextoObjetivoCompacto() {
      const { tipo, subcategoria } = this.formData;
      const horas = parseInt(this.formData.horas) || 0;
      const minutos = parseInt(this.formData.minutos) || 0;
      
      const tiempo = [];
      if (horas > 0) tiempo.push(`${horas}h`);
      if (minutos > 0) tiempo.push(`${minutos}min`);
      
      const textoTiempo = tiempo.length > 0 ? tiempo.join(' ') : '0min';
      const accion = tipo === 'mas' ? '+' : '-';
      
      return `${accion} ${textoTiempo} en ${subcategoria?.title || ''}`;
    },

    limpiarFormulario() {
      this.formData = {
        tipo: 'menos',
        horas: '',
        minutos: '',
        categoriaPrincipal: null,
        subcategoria: null
      };
      this.errores = {
        horas: '',
        minutos: ''
      };
    },

    close() {
      this.$emit('update:dialog', false);
    }
  }
};
</script>

<style scoped>
.compact-dialog {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
  background: white;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
}

.compact-dialog-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.compact-header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.compact-header-icon {
  flex-shrink: 0;
}

.compact-header-text {
  flex: 1;
}

.compact-dialog-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 2px;
  line-height: 1.2;
}

.compact-dialog-subtitle {
  font-size: 0.8rem;
  opacity: 0.9;
  line-height: 1.2;
}

.compact-close-btn {
  color: rgba(255, 255, 255, 0.8) !important;
  flex-shrink: 0;
}

.compact-close-btn:hover {
  color: white !important;
  background: rgba(255, 255, 255, 0.1) !important;
}

.compact-dialog-content {
  padding: 0;
  flex: 1;
  overflow-y: auto;
  max-height: 400px;
}

.compact-form-container {
  padding: 20px;
}

.compact-form-section {
  margin-bottom: 20px;
}

.compact-form-section:last-child {
  margin-bottom: 0;
}

.compact-section-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.compact-toggle-group {
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.compact-toggle-btn {
  flex: 1;
  height: 36px !important;
  font-size: 0.8rem;
  font-weight: 500;
}

.compact-time-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.compact-time-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}

.compact-time-input {
  flex: 1;
}

.compact-time-input :deep(.v-field) {
  font-size: 0.9rem;
}

.compact-time-input :deep(.v-field__input) {
  text-align: center;
  font-weight: 600;
}

.compact-input-label {
  font-weight: 500;
  color: #666;
  font-size: 0.8rem;
}

.compact-time-separator {
  color: #666;
  font-weight: 500;
  font-size: 0.8rem;
  min-width: 16px;
  text-align: center;
}

.compact-time-context {
  color: #666;
  font-size: 0.8rem;
  text-align: center;
  font-weight: 500;
}

.compact-select :deep(.v-field) {
  font-size: 0.9rem;
}

.compact-preview-card {
  border: 1px solid;
  border-radius: 8px;
  margin-top: 6px;
}

.compact-preview-content {
  padding: 12px;
}

.compact-preview-text {
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 0.85rem;
  line-height: 1.2;
}

.compact-dialog-actions {
  padding: 16px 20px;
  border-top: 1px solid #e8ecef;
  background: #f8f9fa;
  flex-shrink: 0;
  gap: 8px;
}

.compact-cancel-btn {
  min-width: 80px;
  font-size: 0.8rem;
}

.compact-create-btn {
  min-width: 90px;
  font-size: 0.8rem;
  font-weight: 600;
}

/* Mensaje de error */
.error-message {
  font-size: 0.7rem;
  color: #ff5252;
  font-weight: 500;
  background: #ffebee;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ffcdd2;
  text-align: center;
  margin-top: 4px;
}

/* Advertencia semántica */
.semantic-warning {
  font-size: 0.7rem;
  color: #ff9800;
  font-weight: 500;
  background: #fff3e0;
  padding: 8px 12px;
  border-radius: 8px;
  border-left: 3px solid #ff9800;
  margin-top: 8px;
  display: flex;
  align-items: center;
}

/* Estilos para campos con error */
.compact-time-input :deep(.v-field--error) {
  border-color: #ff5252 !important;
}

.compact-time-input :deep(.v-messages__message) {
  font-size: 0.7rem;
  margin-top: 2px;
}

/* RESPONSIVE */
@media (max-width: 600px) {
  .compact-dialog-header {
    padding: 14px 16px;
  }
  
  .compact-header-content {
    gap: 8px;
  }
  
  .compact-dialog-title {
    font-size: 1.1rem;
  }
  
  .compact-dialog-subtitle {
    font-size: 0.75rem;
  }
  
  .compact-form-container {
    padding: 16px;
  }
  
  .compact-time-inputs {
    flex-direction: column;
    gap: 8px;
  }
  
  .compact-time-separator {
    order: 2;
  }
  
  .compact-time-context {
    order: 3;
  }
  
  .compact-dialog-actions {
    padding: 14px 16px;
    flex-direction: row;
  }
}
</style>

<style>
.compact-dialog-dropdown {
  background-color: #ffffff !important;
  color: #222 !important;
  opacity: 1 !important;
  border-radius: 8px !important;
  box-shadow: 0 6px 20px rgba(0,0,0,0.18) !important;
  overflow: hidden !important;
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
}

.compact-dialog-dropdown * {
  opacity: 1 !important;
  color: inherit !important;
  background: transparent !important;
}

.compact-dialog-dropdown .v-list {
  background: transparent !important;
  padding: 4px 0 !important;
}

.compact-dialog-dropdown .v-list-item {
  min-height: 40px !important;
  padding: 0 16px !important;
  background: transparent !important;
}

.compact-dialog-dropdown .v-list-item-title {
  color: #222 !important;
  opacity: 1 !important;
}

.compact-dialog-dropdown .v-list-item--active,
.compact-dialog-dropdown .v-list-item:hover,
.compact-dialog-dropdown .v-list-item--focused {
  background-color: #f5f5f5 !important;
}
</style>