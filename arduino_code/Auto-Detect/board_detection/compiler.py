import os, re, shutil

from dicts.fqbn_dict import fqbn


class Compiler:

    def __init__(self, cli_path, sketch_path, board, COM_PORT='COM1'):
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
        # variables:    'cli_path' /arduino-cli.exe compile -b 'fqbn' -u 'sketch_path' -p 'COM_PORT'
        command = f"'{self.cli_path}' compile -b '{self.get_fqbn()}' -u '{self.sketch_path}' -p '{self.COM_PORT}'"
        stripped_command = str(re.sub(r"['\[\]]", "", command))
        output = os.popen(stripped_command).read()
        print(output)

        if '100%' in output:
            return True

        else:
            return False


# this function is static
def server_compile(cli_path, sketch_path, board, dump_path):
    # create a temporary compiler instance:
    temp_compiler = Compiler(cli_path=os.path.abspath(cli_path),
                             sketch_path=os.path.abspath(sketch_path),
                             board=board)

    # extract complete path
    real_dump_path = os.path.abspath(dump_path)
    # runs command: arduino-cli compile -b (fqbn) -u (sketh_path) --build-path (dump_path)
    # variables:    'cli_path' compile -b 'fqbn' -u 'sketch_path' --build-path 'dump_path'
    command = f"'{temp_compiler.cli_path}' compile -b '{temp_compiler.get_fqbn()}' '{temp_compiler.sketch_path}' --build-path {dump_path}"
    stripped_command = str(re.sub(r"['\[\]]", "", command))
    print(stripped_command)
    output = os.popen(stripped_command).read()
    print(output)

    # list dump dir
    files = os.listdir(real_dump_path)

    # remove anything but the bin file
    for file in files:
        file_path = os.path.join(real_dump_path, file)

        # removing files:
        if os.path.isfile(file_path) and not file.endswith('.ino.bin'):
            os.remove(file_path)

        # removing dirs:
        elif os.path.isdir(file_path):
            shutil.rmtree(file_path)


def config(cli_path):
    command = f"'{os.path.abspath(cli_path)}' core install arduino:samd'"
    stripped_command = str(re.sub(r"['\[\]]", "", command))
    os.system(stripped_command)


if __name__ == "__main__":
    # compiles test projekt, og ligger alt det compilede i subfolderen test/test_compiled

    compiler = Compiler(cli_path='arduino-cli_0.34.2_Windows_64bit/arduino-cli.exe',
                        sketch_path='test',
                        board='Arduino MKR WiFi 1010')

    server_compile(compiler.cli_path, compiler.sketch_path, compiler.board, 'test/test_compiled')
