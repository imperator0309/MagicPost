<template>
  <transition name="dialog">
    <div v-if="active" class="dialog-backdrop" @click="handleBackdropClick">
      <div class="dialog-container" @click.stop>
        <slot> </slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "BaseDialog",
  props: {
    active: { type: Boolean, default: false },
    msg: String
  },
  watch: {
    active(newValue) {
      if (newValue) {
      } else {
      }
    }
  },
  methods: {
    handleBackdropClick() {
      this.$emit("update:active", !this.active);
    }
  }
};
</script>

  <style scoped>
  .dialog-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    margin-top: -100px;
  }
  
  .dialog-container {
    max-width: 800px;
    max-height: 80vh; 
    overflow-y: auto; /* Enable vertical scrolling */
    box-shadow: 0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12);
    margin-top: 200px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 250px;
    padding: 15px;
    background-color: #fff;
  }


  
  .dialog-enter-active,
  .dialog-leave-active {
    transition: opacity 0.2s;
  }
  .dialog-enter,
  .dialog-leave-to {
    opacity: 0;
  }
  
  .dialog-enter-active .dialog-container,
  .dialog-leave-active .dialog-container {
    transition: transform 0.4s;
  }
  .dialog-enter .dialog-container,
  .dialog-leave-to .dialog-container {
    transform: scale(0.9);
  }

  table {
      border-collapse: collapse;
      width: 80%; 
      border: 1px solid #ddd; 
      margin: 0 auto; 
      align-items: center;
      justify-content: center;
    }

    table:empty {
        border: none; 
    }
  </style>
  