<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string | null
    name?: string
    label?: string
  }>(),
  {
    name: '',
    label: 'Foto de perfil',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

const maxFileSize = 2 * 1024 * 1024
const allowedTypes = ['image/png', 'image/jpeg', 'image/webp']
const inputId = `avatar-upload-${Math.random().toString(36).slice(2)}`

const fileInput = ref<HTMLInputElement | null>(null)
const errorMessage = ref('')
const isDragging = ref(false)
const isProcessing = ref(false)
const sourceImage = ref<string | null>(null)
const zoom = ref(1)
const preview = computed(() => props.modelValue)
const initials = computed(() => {
  const parts = props.name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return 'IP'
  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
})

function openFileDialog() {
  fileInput.value?.click()
}

function onFileChange(event: Event) {
  errorMessage.value = ''

  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (file) {
    void handleFile(file)
  }

  input.value = ''
}

function onDrop(event: DragEvent) {
  isDragging.value = false
  errorMessage.value = ''

  const file = event.dataTransfer?.files?.[0]
  if (!file) return

  void handleFile(file)
}

async function handleFile(file: File) {
  if (!allowedTypes.includes(file.type)) {
    errorMessage.value = 'Use uma imagem PNG, JPG ou WebP.'
    return
  }

  if (file.size > maxFileSize) {
    errorMessage.value = 'A imagem deve ter no máximo 2MB.'
    return
  }

  isProcessing.value = true

  try {
    const dataUrl = await readAsDataUrl(file)
    sourceImage.value = dataUrl
    zoom.value = 1
    emit('update:modelValue', await cropToSquare(dataUrl, zoom.value))
  } catch {
    errorMessage.value = 'Não foi possível carregar a imagem.'
  } finally {
    isProcessing.value = false
  }
}

function removeAvatar() {
  errorMessage.value = ''
  sourceImage.value = null
  zoom.value = 1
  emit('update:modelValue', null)
}

async function updateCrop() {
  if (!sourceImage.value) return

  isProcessing.value = true
  try {
    emit('update:modelValue', await cropToSquare(sourceImage.value, zoom.value))
  } catch {
    errorMessage.value = 'Não foi possível ajustar a imagem.'
  } finally {
    isProcessing.value = false
  }
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }
      reject(new Error('Resultado inválido.'))
    }
    reader.onerror = () => reject(new Error('Falha ao ler arquivo.'))
    reader.readAsDataURL(file)
  })
}

function cropToSquare(dataUrl: string, scale: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image()

    image.onload = () => {
      const size = 512
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      if (!context) {
        reject(new Error('Canvas indisponível.'))
        return
      }

      canvas.width = size
      canvas.height = size
      const coverScale = Math.max(size / image.width, size / image.height) * scale
      const width = image.width * coverScale
      const height = image.height * coverScale
      const x = (size - width) / 2
      const y = (size - height) / 2

      context.clearRect(0, 0, size, size)
      context.drawImage(image, x, y, width, height)
      resolve(canvas.toDataURL('image/png'))
    }

    image.onerror = () => reject(new Error('Imagem inválida.'))
    image.src = dataUrl
  })
}
</script>

<template>
  <div>
    <label class="mb-1.5 block text-xs font-bold text-gray-200" :for="inputId">{{ label }}</label>

    <div
      class="rounded-xl border border-dashed bg-black/25 p-3 transition"
      :class="
        isDragging
          ? 'border-violet-400 shadow-[0_18px_45px_rgba(124,58,237,0.22)]'
          : 'border-white/10'
      "
      @dragenter.prevent="isDragging = true"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
    >
      <input
        :id="inputId"
        ref="fileInput"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        class="sr-only"
        @change="onFileChange"
      />

      <div class="flex flex-col items-center gap-3 md:flex-row md:items-center">
        <button
          type="button"
          class="group relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-gray-800 to-gray-950 text-lg font-black text-gray-400 shadow-inner ring-2 ring-white/10 transition hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-violet-500/40"
          :aria-label="preview ? 'Trocar foto de perfil' : 'Selecionar foto de perfil'"
          @click="openFileDialog"
        >
          <img
            v-if="preview"
            :src="preview"
            alt="Pré-visualização da foto de perfil"
            class="h-full w-full object-cover"
          />
          <span v-else>{{ initials }}</span>

          <span
            class="absolute inset-0 flex items-center justify-center bg-black/65 text-[10px] font-bold text-white opacity-0 transition group-hover:opacity-100 group-focus:opacity-100"
          >
            Editar
          </span>

          <span
            v-if="isProcessing"
            class="absolute inset-0 flex items-center justify-center bg-black/70"
            role="status"
            aria-live="polite"
          >
            <span class="h-6 w-6 animate-spin rounded-full border-2 border-gray-700 border-t-violet-400" />
          </span>
        </button>

        <div class="min-w-0 flex-1 text-center md:text-left">
          <p class="text-xs font-black text-gray-200">
            Clique na foto ou arraste uma imagem
          </p>
          <p class="mt-1 max-w-[260px] text-[11px] leading-4 text-gray-500">
            Preview em tempo real, recorte circular e PNG/JPG/WebP até 2MB.
          </p>

          <div class="mt-2.5 flex flex-wrap justify-center gap-2 md:justify-start">
            <button
              type="button"
              class="rounded-lg bg-violet-600 px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-[#111019]"
              @click="openFileDialog"
            >
              {{ preview ? 'Trocar imagem' : 'Escolher imagem' }}
            </button>
            <button
              v-if="preview"
              type="button"
              class="rounded-lg border border-white/10 px-3 py-1.5 text-[11px] font-semibold text-gray-400 transition hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-[#111019]"
              @click="removeAvatar"
            >
              Remover
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="preview && sourceImage"
        class="mt-3 rounded-xl border border-white/10 bg-black/25 px-3 py-2"
      >
        <div class="flex items-center justify-between gap-3">
          <span class="text-[11px] font-bold text-gray-300">Ajustar enquadramento</span>
          <span class="text-[11px] text-gray-500">{{ Math.round(zoom * 100) }}%</span>
        </div>
        <input
          v-model.number="zoom"
          type="range"
          min="1"
          max="2"
          step="0.05"
          class="mt-2 h-2 w-full cursor-pointer accent-violet-500"
          aria-label="Ajustar enquadramento da foto"
          @input="updateCrop"
        />
      </div>

      <p v-if="isDragging" class="mt-3 text-center text-xs font-semibold text-violet-200">
        Solte a imagem para definir sua foto de perfil.
      </p>
    </div>

    <p v-if="errorMessage" class="mt-2 rounded-xl bg-red-500/10 p-2.5 text-xs text-red-200" role="alert">
      {{ errorMessage }}
    </p>
  </div>
</template>
