<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { createCircuit, type CircuitHandle } from '@circuit-box'

  let hostEl: HTMLDivElement
  let circuit: CircuitHandle | null = null

  onMount(() => {
    circuit = createCircuit(hostEl, {
      canvas: { backgroundColor: '#ffffff' },
      grid: {
        spacing: 25,
        majorInterval: 5,
        style: {
          minorLineColor: 'rgba(0, 0, 0, 0.08)',
          majorLineColor: 'rgba(0, 0, 0, 0.16)',
          originColor: 'rgba(255, 0, 0, 0.4)'
        }
      }
    })
  })

  onDestroy(() => {
    circuit?.destroy()
    circuit = null
  })
</script>

<div class="h-screen w-screen flex items-center justify-center">
  <div class="h-150 w-200 border rounded-md overflow-hidden" bind:this={hostEl}></div>
</div>