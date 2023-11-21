import os, re
from dicts.fqbn_dict import fqbn


class Compiler:

    def __init__(self, cli_path, sketch_path, board, COM_PORT):
        self.cli_path = os.path.abspath(cli_path)
        self.sketch_path = os.path.abspath(sketch_path)
        self.COM_PORT = COM_PORT
        self.board = board
        self.fqbn = self.get_fqbn()

    def get_fqbn(self):
        entry = fqbn.get(self.board)
        if entry:
            return entry[0]  # The first element of the tuple is the FQBN
        else:
            return None

    def compile(self):
        # runs command: arduino-cli compile -b (fqbn) -u (sketch_path) -p (COM)
        # variables:    'cli_path' compile -b 'fqbn' -u 'sketch_path' -p 'COM_PORT'
        command = f"'{self.cli_path}' compile -b '{self.get_fqbn()}' -u '{self.sketch_path}' -p '{self.COM_PORT}'"
        stripped_command = str(re.sub(r"['\[\]]", "", command))
        output = os.popen(stripped_command).read()
        print(output)

        if '100%' in output:
            return True

        else:
            return False
