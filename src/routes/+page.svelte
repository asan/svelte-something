<script lang="ts">
	import { fetchCoffee, IDLE_TIMEOUT, type Coffee } from "$lib";

  const collection: Coffee[] = $state([])

  let isLoading = $state(false)
  let lastError: string | null = $state(null)
  async function addCoffee() {
    // this function may be called from effect
    // so it's not enough to just disable button
    if(isLoading) return;

    // not a big fan of this pattern because it 
    // very verbose and had too much possible
    // invalid states if you forget to set loading
    // or clear error
    // looks like async block can solve this
    lastError = null
    isLoading = true
    try {
      const coffee = await fetchCoffee();
      collection.push(coffee)
    } catch(e: any) {
      lastError = e.toString()
    } finally {
      isLoading = false
    }
  }

  // we have a trade off here:
  // either it can take up to 2 IDLE_TIMEOUT in worst case
  // before card would be added after user interaction
  // or we need to constantly add / remove interval
  // after any user interaction
  // I selected first one because it should be
  // more performant on low end devices
  let lastInteractionTime = $state(Date.now())
  function onInteraction() {
    lastInteractionTime = Date.now()
  }
  $effect(()=>{
    const intervalId = setInterval(()=>{
      if(Date.now() - lastInteractionTime >= IDLE_TIMEOUT) {
        addCoffee()
      }
    }, IDLE_TIMEOUT)
    return ()=>{
      clearInterval(intervalId)
    }
  })

  addCoffee()

</script>
<main onmousemove={onInteraction} ontouchstart={onInteraction}>
  <pre>
    {JSON.stringify(collection, null, 2)}
  </pre>
  <button onclick={addCoffee} disabled={isLoading}>load</button>
  <pre>
    isLoading: {isLoading}
    error: {lastError}
    lastInteractionTime: {lastInteractionTime}
  </pre>
</main>