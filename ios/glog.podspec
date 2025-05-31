Pod::Spec.new do |s|
    s.name         = "glog"
    s.version      = "0.3.5"
    s.summary      = "Google logging module"
    s.homepage     = "https://github.com/google/glog"
    s.license      = "BSD"
    s.authors      = { "The glog Authors" => "google-glog@googlegroups.com" }
    s.source       = { :git => "https://github.com/google/glog.git", :tag => "v#{s.version}" }
    s.ios.deployment_target = "13.0"
    s.source_files = "src/**/*.{h,cc}"
    s.public_header_files = "src/glog/*.h"
    s.pod_target_xcconfig = { "USE_HEADERMAP" => "NO" }
    s.compiler_flags = "-Wno-shorten-64-to-32"
  end