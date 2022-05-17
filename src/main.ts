import * as core from '@actions/core';
export async function run() {
    core.info("Generate settings.xml for Maven Builds")
}
  
run().catch(core.setFailed);