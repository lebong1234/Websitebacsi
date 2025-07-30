// Mobile interactions and enhancements
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile sidebar toggle
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const sidebar = document.getElementById('sidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    
    if (mobileNavToggle && sidebar && mobileOverlay) {
        mobileNavToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
            mobileOverlay.classList.toggle('show');
        });
        
        mobileOverlay.addEventListener('click', function() {
            sidebar.classList.remove('show');
            mobileOverlay.classList.remove('show');
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 576) {
                if (!sidebar.contains(e.target) && !mobileNavToggle.contains(e.target)) {
                    sidebar.classList.remove('show');
                    mobileOverlay.classList.remove('show');
                }
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 576) {
                sidebar.classList.remove('show');
                mobileOverlay.classList.remove('show');
            }
        });
    }
    
    // Mobile search toggle
    const searchToggle = document.querySelector('.search-toggle');
    const searchForm = document.querySelector('nav form');
    
    if (searchToggle && searchForm) {
        searchToggle.addEventListener('click', function() {
            searchForm.classList.toggle('show');
        });
    }
    
    // Enhanced form validation for mobile
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                    
                    // Show mobile-friendly error message
                    if (window.innerWidth <= 576) {
                        const errorMsg = document.createElement('div');
                        errorMsg.className = 'invalid-feedback d-block';
                        errorMsg.textContent = 'Trường này là bắt buộc';
                        
                        const existingError = field.parentNode.querySelector('.invalid-feedback');
                        if (!existingError) {
                            field.parentNode.appendChild(errorMsg);
                        }
                    }
                } else {
                    field.classList.remove('is-invalid');
                    const errorMsg = field.parentNode.querySelector('.invalid-feedback');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                if (window.innerWidth <= 576) {
                    alert('Vui lòng điền đầy đủ thông tin bắt buộc');
                }
            }
        });
    });
    
    // Mobile-friendly table interactions
    const tables = document.querySelectorAll('.table');
    tables.forEach(table => {
        if (window.innerWidth <= 576) {
            // Add swipe gestures for table rows
            let startX = 0;
            let startY = 0;
            
            table.addEventListener('touchstart', function(e) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            });
            
            table.addEventListener('touchmove', function(e) {
                if (!startX || !startY) return;
                
                const diffX = startX - e.touches[0].clientX;
                const diffY = startY - e.touches[0].clientY;
                
                if (Math.abs(diffX) > Math.abs(diffY)) {
                    if (diffX > 0) {
                        // Swipe left - show actions
                        const row = e.target.closest('tr');
                        if (row) {
                            row.classList.add('show-actions');
                        }
                    } else {
                        // Swipe right - hide actions
                        const row = e.target.closest('tr');
                        if (row) {
                            row.classList.remove('show-actions');
                        }
                    }
                }
                
                startX = 0;
                startY = 0;
            });
        }
    });
    
    // Mobile-friendly modal handling
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (window.innerWidth <= 576) {
            modal.addEventListener('show.bs.modal', function() {
                document.body.style.overflow = 'hidden';
            });
            
            modal.addEventListener('hidden.bs.modal', function() {
                document.body.style.overflow = 'auto';
            });
        }
    });
    
    // Mobile-friendly image preview
    const imageInputs = document.querySelectorAll('input[type="file"][accept*="image"]');
    imageInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.createElement('img');
                    preview.src = e.target.result;
                    preview.style.maxWidth = '100%';
                    preview.style.height = 'auto';
                    preview.style.marginTop = '10px';
                    preview.style.borderRadius = '8px';
                    
                    const container = input.parentNode;
                    const existingPreview = container.querySelector('img');
                    if (existingPreview) {
                        existingPreview.remove();
                    }
                    container.appendChild(preview);
                };
                reader.readAsDataURL(file);
            }
        });
    });
    
    // Mobile-friendly loading states
    const loadingButtons = document.querySelectorAll('.btn[data-loading]');
    loadingButtons.forEach(button => {
        button.addEventListener('click', function() {
            const originalText = button.innerHTML;
            button.innerHTML = '<span class="loading-spinner"></span> Đang xử lý...';
            button.disabled = true;
            button.classList.add('loading');
            
            // Re-enable after a delay (for demo purposes)
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
                button.classList.remove('loading');
            }, 2000);
        });
    });
    
    // Mobile-friendly tooltips
    if (window.innerWidth <= 576) {
        const tooltipElements = document.querySelectorAll('[title]');
        tooltipElements.forEach(element => {
            element.addEventListener('click', function(e) {
                const title = this.getAttribute('title');
                if (title) {
                    // Create mobile-friendly tooltip
                    const tooltip = document.createElement('div');
                    tooltip.className = 'mobile-tooltip';
                    tooltip.textContent = title;
                    tooltip.style.cssText = `
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: rgba(0, 0, 0, 0.8);
                        color: white;
                        padding: 10px 15px;
                        border-radius: 8px;
                        z-index: 9999;
                        font-size: 14px;
                        max-width: 80%;
                        text-align: center;
                    `;
                    
                    document.body.appendChild(tooltip);
                    
                    setTimeout(() => {
                        tooltip.remove();
                    }, 2000);
                    
                    e.preventDefault();
                }
            });
        });
    }
    
    // Mobile-friendly keyboard navigation
    if (window.innerWidth <= 576) {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                // Close sidebar
                if (sidebar && sidebar.classList.contains('show')) {
                    sidebar.classList.remove('show');
                    mobileOverlay.classList.remove('show');
                }
                
                // Close modals
                const openModals = document.querySelectorAll('.modal.show');
                openModals.forEach(modal => {
                    const modalInstance = bootstrap.Modal.getInstance(modal);
                    if (modalInstance) {
                        modalInstance.hide();
                    }
                });
            }
        });
    }
    
    // Mobile-friendly scroll to top
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="bx bx-chevron-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--blue);
        color: white;
        border: none;
        font-size: 20px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
        display: none;
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'block';
            scrollToTopBtn.style.opacity = '1';
        } else {
            scrollToTopBtn.style.opacity = '0';
            setTimeout(() => {
                if (scrollToTopBtn.style.opacity === '0') {
                    scrollToTopBtn.style.display = 'none';
                }
            }, 300);
        }
    });
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Mobile-friendly pull-to-refresh (basic implementation)
    let startY = 0;
    let pullDistance = 0;
    const pullThreshold = 100;
    
    document.addEventListener('touchstart', function(e) {
        if (window.pageYOffset === 0) {
            startY = e.touches[0].clientY;
        }
    });
    
    document.addEventListener('touchmove', function(e) {
        if (startY > 0 && window.pageYOffset === 0) {
            pullDistance = e.touches[0].clientY - startY;
            if (pullDistance > 0) {
                e.preventDefault();
            }
        }
    });
    
    document.addEventListener('touchend', function(e) {
        if (pullDistance > pullThreshold) {
            location.reload();
        }
        startY = 0;
        pullDistance = 0;
    });
}); 