import ast
import unittest
from pathlib import Path

SCRIPT=Path(__file__).resolve().parent/"oracle-transport-bridge/activate-england-compact.py"

class ActivationStaticSafety(unittest.TestCase):
 def test_script_syntax_and_rollback(self):
  source=SCRIPT.read_text()
  ast.parse(source)
  for x in ('BACKUP="pocketai-england-local-rollback"',
            'PORT="8768"','CANDIDATE="/home/ubuntu/pocketai-england-candidate/feeds"',
            'check_before()','new_england_service_failed_health_or_nine_feed_probe',
            'ACTIVATION_FAILED_STARTING_AUTOMATIC_ROLLBACK',
            'ROLLBACK_CONTAINER_RETAINED_STOPPED',
            'OTHER_SERVICES_UNCHANGED',
            'network=old["HostConfig"].get("NetworkMode")',
            'details.get("Driver")!="bridge"',
            '"--network",network,'):
   self.assertIn(x,source)
  for forbidden in ('docker("system","prune"','docker("volume","rm"',
                    'docker("rm","-f","pocketai-romania-urban"',
                    'docker("rm","-f","pocketai-comunicare-gateway"'):
   self.assertNotIn(forbidden,source)

if __name__=="__main__":unittest.main()
