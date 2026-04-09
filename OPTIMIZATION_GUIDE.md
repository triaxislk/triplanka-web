# Local Image Optimization

To ensure that your images are always optimized before you push them to GitHub, you can run the following PowerShell command in your project root:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/optimize_images.ps1
```

### Automation (Recommended)
You can set this up to run **automatically** every time you commit by adding a git "pre-commit" hook.

1.  Create a file named `.git/hooks/pre-commit` (no extension).
2.  Add the following line to it:
    ```bash
    powershell.exe -ExecutionPolicy Bypass -File scripts/optimize_images.ps1
    ```
3.  Now, whenever you `git commit`, your images will be checked and optimized if they are larger than 5MB.

### GitHub Automation
We have also updated your GitHub Action (`.github/workflows/optimize-images.yml`). Every time you push images to GitHub, they will be further compressed by the `calibreapp/image-actions` tool.

### Backups
Original large versions of images are moved to `backups/images_original/` before they are replaced. You can review them there or delete them if you are happy with the results.
