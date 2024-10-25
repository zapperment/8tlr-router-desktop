import path from "node:path";
import fs from "node:fs";
import { findFile } from "./findFile";

// Mock the 'fs' module
vi.mock("fs");

describe("The findFile function", () => {
  it("should find the file in the current directory", () => {
    const startDir = "/project/current";
    const fileName = "config.yaml";
    const expectedFilePath = path.join(startDir, fileName);

    vi.mocked(fs.existsSync).mockImplementation((filePath) => {
      return filePath === expectedFilePath;
    });

    const result = findFile(startDir, fileName);

    expect(result).toBe(expectedFilePath);
    expect(fs.existsSync).toHaveBeenCalledWith(expectedFilePath);
  });

  it("should find the file in a parent directory", () => {
    const startDir = "/project/current";
    const parentDir = "/project";
    const fileName = "config.yaml";
    const expectedFilePath = path.join(parentDir, fileName);

    vi.mocked(fs.existsSync).mockImplementation((filePath) => {
      if (filePath === path.join(startDir, fileName)) {
        return false;
      } else if (filePath === expectedFilePath) {
        return true;
      }
      return false;
    });

    const result = findFile(startDir, fileName);

    expect(result).toBe(expectedFilePath);
    expect(fs.existsSync).toHaveBeenCalledWith(path.join(startDir, fileName));
    expect(fs.existsSync).toHaveBeenCalledWith(expectedFilePath);
  });

  it("should return null if the file is not found in any directory", () => {
    const startDir = "/project/current";
    const fileName = "config.yaml";

    vi.mocked(fs.existsSync).mockImplementation(() => false);

    const result = findFile(startDir, fileName);

    expect(result).toBeNull();
    expect(fs.existsSync).toHaveBeenCalled();
  });

  it("should stop at the root directory if the file is not found", () => {
    const startDir = "/";
    const fileName = "config.yaml";

    vi.mocked(fs.existsSync).mockImplementation(() => false);

    const result = findFile(startDir, fileName);

    expect(result).toBeNull();
    expect(fs.existsSync).toHaveBeenCalledWith(path.join(startDir, fileName));
  });

  afterEach(() => {
    vi.clearAllMocks(); // Clear any mock calls between tests
  });
});
