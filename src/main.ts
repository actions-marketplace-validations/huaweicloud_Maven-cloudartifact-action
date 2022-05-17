import * as core from '@actions/core';

import * as context from './context';
export async function run() {
    core.info("Generate settings.xml for Maven Builds")
    const inputs: context.Inputs = context.getInputs();
    for (let key in inputs) {
        console.log(key)
        console.log((inputs as any)[key]); 
        // do something
      }
}
  
run().catch(core.setFailed);