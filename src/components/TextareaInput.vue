<template>
  <div class="w-full">
    <!-- Label for accessibility -->
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-gray-700 mb-2"
    >
      {{ label }}
    </label>

    <!-- Textarea element -->
    <textarea
      :id="inputId"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="disabled"
      :required="required"
      :maxlength="maxLength"
      :class="textareaClasses"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
    />

    <!-- Character count display -->
    <div
      v-if="showCharacterCount && maxLength"
      class="flex justify-between items-center mt-1 text-xs text-gray-500"
    >
      <span
        v-if="errorMessage"
        class="text-red-500"
        >{{ errorMessage }}</span
      >
      <span class="ml-auto"> {{ characterCount }}/{{ maxLength }} </span>
    </div>

    <!-- Error message display -->
    <p
      v-else-if="errorMessage"
      class="mt-1 text-xs text-red-500"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type ComputedRef } from 'vue';

/**
 * Props interface for the TextareaInput component
 */
interface Props {
  /** The v-model value for two-way data binding */
  modelValue?: string;
  /** Label text displayed above the textarea */
  label?: string;
  /** Placeholder text shown when textarea is empty */
  placeholder?: string;
  /** Number of visible text lines */
  rows?: number;
  /** Whether the textarea is disabled */
  disabled?: boolean;
  /** Whether the textarea is required */
  required?: boolean;
  /** Maximum number of characters allowed */
  maxLength?: number;
  /** Whether to show character count */
  showCharacterCount?: boolean;
  /** Error message to display */
  errorMessage?: string;
  /** Additional CSS classes */
  class?: string;
}

/**
 * Events interface for the TextareaInput component
 */
interface Emits {
  /** Emitted when the value changes (for v-model) */
  'update:modelValue': [value: string];
  /** Emitted when textarea receives focus */
  focus: [event: FocusEvent];
  /** Emitted when textarea loses focus */
  blur: [event: FocusEvent];
  /** Emitted on keydown events */
  keydown: [event: KeyboardEvent];
}

// Define component props with defaults
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Enter your text here...',
  rows: 4,
  disabled: false,
  required: false,
  showCharacterCount: false,
  class: '',
});

// Define component events
const emit = defineEmits<Emits>();

// Generate unique ID for accessibility
const inputId = ref(`textarea-${Math.random().toString(36).substr(2, 9)}`);

/**
 * Computed property for character count
 */
const characterCount: ComputedRef<number> = computed(() => {
  return props.modelValue.length;
});

/**
 * Computed property for dynamic textarea classes
 */
const textareaClasses: ComputedRef<string> = computed(() => {
  const baseClasses = [
    'block w-full rounded-md border-0 py-2 px-3 text-gray-900',
    'shadow-sm ring-1 ring-inset placeholder:text-gray-400',
    'focus:ring-2 focus:ring-inset focus:ring-blue-600',
    'sm:text-sm sm:leading-6 resize-y transition-colors duration-200',
  ];

  // Add error styling if there's an error message
  if (props.errorMessage) {
    baseClasses.push('ring-red-300 focus:ring-red-500');
  } else {
    baseClasses.push('ring-gray-300');
  }

  // Add disabled styling
  if (props.disabled) {
    baseClasses.push('bg-gray-50 text-gray-500 cursor-not-allowed');
  } else {
    baseClasses.push('bg-white');
  }

  // Add custom classes
  if (props.class) {
    baseClasses.push(props.class);
  }

  return baseClasses.join(' ');
});

/**
 * Handle input events and emit value changes
 */
const handleInput = (event: Event): void => {
  const target = event.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);
};

/**
 * Handle focus events
 */
const handleFocus = (event: FocusEvent): void => {
  emit('focus', event);
};

/**
 * Handle blur events
 */
const handleBlur = (event: FocusEvent): void => {
  emit('blur', event);
};

/**
 * Handle keydown events
 */
const handleKeydown = (event: KeyboardEvent): void => {
  emit('keydown', event);
};
</script>
