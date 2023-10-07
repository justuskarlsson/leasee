<script lang="ts">
  import { auth } from "$lib/client/firebase"
  import { createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth'

  let email = "";
  let password = "";

  async function login(){
    const res = await signInWithEmailAndPassword(auth, email, password);
  }


  async function register(){
    let res = await createUserWithEmailAndPassword(auth, email, password);
  }

  function maybeSubmit(e: KeyboardEvent) {
    if (e.key === "Enter") {
      login();
      e.preventDefault();
    }
  }

</script>


<div class="
  w-full max-w-xs flex flex-col mx-auto mt-36"
  >

  <div class="input-container">
    <label class="label">
      <span class="label-text">Email:</span>
    </label>
    <input type="email" placeholder="Type here" bind:value={email} 
           />
  </div>
  <div class="input-container">
    <label class="label">
      <span class="label-text">Password:</span>
    </label>
    <input type="password" placeholder="Type here" on:keydown={maybeSubmit} bind:value={password} 
         />
  </div>
  <div class="mt-4 flex flex-row justify-evenly">
    <button class="btn bg-green-500 hover:bg-green-700 " on:click={login} >Login</button>
    <button class="btn bg-green-500 hover:bg-green-700" on:click={register} >Register</button>
  </div>
</div>

<style lang="postcss">
  input {
    @apply w-full max-w-xs p-2 rounded-xl border-2 border-gray-300;
  }

  label > span {
    @apply pl-2 mb-2;
  }

  .input-container {
    @apply mt-2;
  }

  .btn {
    @apply  text-white font-bold py-2 px-4 rounded;
  }
</style>