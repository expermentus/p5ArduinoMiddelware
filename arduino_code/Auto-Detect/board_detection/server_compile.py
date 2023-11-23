from compiler import server_compile
import sys

if __name__ == "__main__":
    cli_path = sys.argv[1]
    sketch_path = sys.argv[2]
    board = sys.argv[3]
    dump_path = sys.argv[4]

    server_compile(cli_path, sketch_path, board, dump_path)

